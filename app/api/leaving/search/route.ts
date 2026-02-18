// app/api/members/search/route.ts
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
      return NextResponse.json({ 
        message: "Unauthorized",
        members: [] 
      }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ 
        message: "Invalid token",
        members: [] 
      }, { status: 401 });
    }

    const pastor = await User.findById(decoded.userId);
    if (!pastor) {
      return NextResponse.json({ 
        message: "User not found",
        members: [] 
      }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // Return empty array for short queries (not an error)
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        message: "Query too short",
        members: [] 
      }, { status: 200 }); // Change to 200, not 400
    }

    // Create case-insensitive regex
    const searchRegex = new RegExp(query, 'i');

    // Search members
    const members = await Member.find({
      church: pastor.church,
      $or: [
        { firstName: { $regex: searchRegex } },
        { lastName: { $regex: searchRegex } },
        { middleName: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } }
      ]
    })
    .select("firstName middleName lastName phone isFamily children")
    .lean();

    return NextResponse.json({
      message: "Members fetched successfully",
      members,
      count: members.length
    }, { status: 200 });

  } catch (error) {
    console.error("Search members error:", error);
    return NextResponse.json(
      { 
        message: "Failed to search members",
        members: [] 
      },
      { status: 500 }
    );
  }
}