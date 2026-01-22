// app/api/auth/login/route.ts - UPDATED
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

  console.log("Login attempt:", email); // Debug

  if (!email || !password) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  try {
    // Find user and populate church
    const user = await User.findOne({ email }).populate("church");
    
    if (!user) {
      console.log("User not found:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    console.log("User found with church:", user.church);

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("Password mismatch for:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(user._id.toString());

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
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;

  } catch (error: unknown) {
  console.error("Login error:", error);

  // Narrow error to Error type
  const message = error instanceof Error ? error.message : String(error);

  return NextResponse.json({ 
    message: "Login failed", 
    error: message
  }, { status: 500 });
}
}