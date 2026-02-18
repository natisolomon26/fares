import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User, Church } from "@/lib/models";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ cookies() must be awaited
    const cookieStore = await cookies();
    const token = cookieStore.get("churchflow_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.userId)
      .select("email role church createdAt")
      .populate("church"); // Church model must be registered via lib/models

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET /me error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
