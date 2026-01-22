import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const user = await User.findOne({ email }).populate("church");
  if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

  const token = signToken(user._id.toString());

  // Create a secure httpOnly cookie
  const response = NextResponse.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: user.church
        ? { id: user.church._id, name: user.church.name }
        : null,
    },
  });

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
