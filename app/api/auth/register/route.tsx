// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Church from "@/models/Church"; // Must exist
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password, churchName } = await req.json();

  if (!email || !password || !churchName) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // 1️⃣ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  // 2️⃣ Find or create church (we store _id in user)
  let church = await Church.findOne({ name: churchName });
  if (!church) {
    church = await Church.create({ name: churchName });
  }

  // 3️⃣ Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4️⃣ Create user with church ObjectId
  const user = await User.create({
    email,
    password: hashedPassword,
    church: church._id, // ✅ Must be ObjectId, not name
    role: "admin",
  });

  // 5️⃣ Return user info
  return NextResponse.json({
    message: "User created successfully",
    user: {
      id: user._id,
      email: user.email,
      church: {
        id: church._id,
        name: church.name,
      },
      role: user.role,
    },
  });
}
