// Updated register API
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Church from "@/models/Church"; // Import Church model
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { email, password, churchName } = await req.json();

    if (!email || !password || !churchName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 }
      );
    }

    // 1. Create Church first
    const church = await Church.create({
      name: churchName,
      // You can add more church details here
    });

    const hashed = await bcrypt.hash(password, 10);

    // 2. Create User with church reference
    const user = await User.create({
      email,
      password: hashed,
      role: "PASTOR",
      church: church._id, // Store church ObjectId
    });

    // 3. Update Church with pastor reference
    await Church.findByIdAndUpdate(church._id, { pastor: user._id });

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
    });

    const res = NextResponse.json({
      message: "Account created",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        church: church, // Include church details
      },
    });

    res.cookies.set("churchflow_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}