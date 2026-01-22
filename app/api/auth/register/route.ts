// app/api/auth/register/route.ts - UPDATED VERSION
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

  console.log("Registration attempt:", { email, churchName }); // Debug log

  if (!email || !password || !churchName) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 409 });
  }

  try {
    // Create or find church
    let church = await Church.findOne({ name: churchName });
    
    if (!church) {
      console.log("Creating new church:", churchName);
      church = await Church.create({ name: churchName });
    } else {
      console.log("Found existing church:", churchName);
    }

    console.log("Church created/found:", church._id, church.name);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITH church reference
    const user = await User.create({
      email,
      password: hashedPassword,
      church: church._id, // This is crucial!
      role: "PASTOR",
    });

    console.log("User created with church:", user._id, user.church);

    // Sign JWT token
    const token = signToken(user._id.toString());

    // Return response
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