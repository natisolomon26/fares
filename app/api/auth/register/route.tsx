// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Church from "@/models/Church";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password, churchName } = await req.json();

  if (!email || !password || !churchName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  // Create or find church
  let church = await Church.findOne({ name: churchName });
  if (!church) {
    church = await Church.create({ name: churchName });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    church: church._id,
  });

  return NextResponse.json({
    message: "User created successfully",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: { id: church._id, name: church.name },
    },
  });
}
