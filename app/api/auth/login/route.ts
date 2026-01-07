// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import Church from "@/models/Church";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: Request) {
  await connectToDatabase();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Missing email or password" },
      { status: 400 }
    );
  }

  // 1️⃣ Find user by email
  const user = await User.findOne({ email }).populate("church"); // populate church info
  if (!user) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // 2️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // 3️⃣ Return user info + church info
  return NextResponse.json({
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: {
        id: user.church._id,
        name: user.church.name,
      },
    },
  });
}
