// app/api/leaving/stats/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Leaving from "@/models/Leaving";
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

    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year") || new Date().getFullYear();

    // Get date range for the year
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    // Aggregate statistics
    const stats = await Leaving.aggregate([
      {
        $match: {
          churchId: pastor.church,
          leavingDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          revoked: {
            $sum: { $cond: [{ $eq: ["$status", "revoked"] }, 1, 0] },
          },
          transfer: {
            $sum: { $cond: [{ $eq: ["$reason", "transfer"] }, 1, 0] },
          },
          relocation: {
            $sum: { $cond: [{ $eq: ["$reason", "relocation"] }, 1, 0] },
          },
          personal: {
            $sum: { $cond: [{ $eq: ["$reason", "personal"] }, 1, 0] },
          },
          other: {
            $sum: { $cond: [{ $eq: ["$reason", "other"] }, 1, 0] },
          },
        },
      },
    ]);

    // Monthly breakdown
    const monthlyStats = await Leaving.aggregate([
      {
        $match: {
          churchId: pastor.church,
          leavingDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$leavingDate" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      revoked: 0,
      transfer: 0,
      relocation: 0,
      personal: 0,
      other: 0,
    };

    return NextResponse.json({
      message: "Statistics fetched successfully",
      stats: result,
      monthly: monthlyStats,
      year: parseInt(year as string),
    });
  } catch (error) {
    console.error("GET leaving stats error:", error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}