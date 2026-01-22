// app/api/leaves/route.ts
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import LeaveRequest from "@/models/LeaveRequest";
import Member from "@/models/Member";
import { getUserFromToken } from "@/lib/auth"; // your JWT auth

// Create a leave request
export async function POST(req: Request) {
  await connectToDatabase();

  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { memberId, type, startDate, endDate, reason } = body;

    if (!memberId || !type || !startDate || !endDate || !reason) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if member exists AND belongs to admin's church
    const member = await Member.findOne({
      _id: new mongoose.Types.ObjectId(memberId),
      church: new mongoose.Types.ObjectId(user.church),
    });

    if (!member) return NextResponse.json({ message: "Member not found in your church" }, { status: 404 });

    // Create leave request
    const leaveRequest = await LeaveRequest.create({
      member: member._id,
      church: user.church,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: "pending", // default
      createdBy: user._id,
    });

    await leaveRequest.populate("member");

    return NextResponse.json({ message: "Leave request created", leaveRequest });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error", error: err.message || err }, { status: 500 });
  }
}

// Get all leave requests in the admin's church
export async function GET(req: Request) {
  await connectToDatabase();

  try {
    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const leaves = await LeaveRequest.find({ church: user.church })
      .populate("member")
      .populate("church")
      .sort({ createdAt: -1 });

    return NextResponse.json({ leaves });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error", error: err.message || err }, { status: 500 });
  }
}
