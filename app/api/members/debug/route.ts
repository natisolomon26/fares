// app/api/members/debug/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("churchflow_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const pastor = await User.findById(decoded.userId);
    if (!pastor) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get all members for this church
    const allMembers = await Member.find({ church: pastor.church })
      .select("firstName middleName lastName phone")
      .lean();

    return NextResponse.json({
      churchId: pastor.church,
      pastorEmail: pastor.email,
      totalMembers: allMembers.length,
      members: allMembers
    });

  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}