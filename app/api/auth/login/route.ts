// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Church from "@/models/Church";
import { connectToDatabase } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectToDatabase();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
  }

  const user = await User.findOne({ email }).populate("church");
  if (!user) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
  }

  const token = signToken(user._id.toString());

  return NextResponse.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: user.church ? { id: user.church._id, name: user.church.name } : null,
    },
  });
}
