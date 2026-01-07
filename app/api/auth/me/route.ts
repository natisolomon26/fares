// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: Request) {
  await connectToDatabase();

  // Expect user ID as query param (or replace with token later)
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "Missing userId" }, { status: 400 });
  }

  // Find user and populate church info
  const user = await User.findById(userId).populate("church");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
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
