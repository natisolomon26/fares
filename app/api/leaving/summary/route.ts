// app/api/leaving/summary/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Leaving from "@/models/Leaving";
import Member from "@/models/Member";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const token = cookieStore.get("churchflow_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const pastor = await User.findById(decoded.userId);
    if (!pastor) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get current date for comparisons
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Run parallel queries for summary data
    const [
      totalLeavings,
      recentLeavings,
      statusBreakdown,
      reasonBreakdown,
      totalMembers
    ] = await Promise.all([
      // Total leavings
      Leaving.countDocuments({ churchId: pastor.church }),
      
      // Recent leavings (last 30 days)
      Leaving.countDocuments({ 
        churchId: pastor.church,
        leavingDate: { $gte: thirtyDaysAgo }
      }),
      
      // Status breakdown
      Leaving.aggregate([
        { $match: { churchId: pastor.church } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      
      // Reason breakdown
      Leaving.aggregate([
        { $match: { churchId: pastor.church } },
        { $group: { _id: "$reason", count: { $sum: 1 } } }
      ]),
      
      // Total active members
      Member.countDocuments({ 
        church: pastor.church,
        status: "active" 
      })
    ]);

    // Format breakdowns
    const statuses = {
      active: 0,
      revoked: 0,
      archived: 0
    };
    statusBreakdown.forEach(item => {
      statuses[item._id as keyof typeof statuses] = item.count;
    });

    const reasons = {
      transfer: 0,
      relocation: 0,
      personal: 0,
      other: 0
    };
    reasonBreakdown.forEach(item => {
      reasons[item._id as keyof typeof reasons] = item.count;
    });

    return NextResponse.json({
      message: "Summary fetched successfully",
      summary: {
        totalLeavings,
        recentLeavings,
        totalMembers,
        leavingRate: totalMembers > 0 
          ? Number(((totalLeavings / totalMembers) * 100).toFixed(1))
          : 0,
        statuses,
        reasons,
      },
    });
  } catch (error) {
    console.error("Summary error:", error);
    return NextResponse.json(
      { message: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}