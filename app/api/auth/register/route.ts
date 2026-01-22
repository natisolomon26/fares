import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Church from "@/models/Church";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectToDatabase();

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  const email = body.email?.toLowerCase().trim();
  const password = body.password;
  const churchName = body.churchName?.trim();

  if (!email || !password || !churchName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  // Create or find the church
  const church = await Church.findOneAndUpdate(
    { name: churchName },
    { $setOnInsert: { name: churchName } },
    { new: true, upsert: true }
  );

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = await User.create({
    email,
    password: hashedPassword,
    church: church._id,
  });

  // Sign JWT token
  const token = signToken(user._id.toString());

  // Return response with httpOnly cookie
  const response = NextResponse.json(
    {
      message: "Account created successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        church: { id: church._id, name: church.name },
      },
    },
    { status: 201 }
  );

  response.cookies.set({
    name: "churchflow_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
  });

  return response;
}
