import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import LeaveRequest from "@/models/LeaveRequest";
import { getUserFromToken } from "@/lib/auth";

// Helper function to get leave ID from params
async function getLeaveId(params: Promise<{ id: string }>) {
  const { id } = await params;
  return id;
}

// GET - Fetch a specific leave request
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const leaveId = await getLeaveId(params);

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const leave = await LeaveRequest.findOne({
      _id: leaveId,
      church: user.church,
    })
      .populate("member", "name email phone")
      .populate("church", "name")
      .populate("createdBy", "name email");

    if (!leave) {
      return NextResponse.json(
        { message: "Leave request not found in your church" },
        { status: 404 }
      );
    }

    return NextResponse.json({ leave });
  } catch (error) {
    console.error("GET leave error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update a leave request
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const leaveId = await getLeaveId(params);

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();

    // Check if leave request exists and belongs to user's church
    const existingLeave = await LeaveRequest.findOne({
      _id: leaveId,
      church: user.church,
    });

    if (!existingLeave) {
      return NextResponse.json(
        { message: "Leave request not found in your church" },
        { status: 404 }
      );
    }

    // Update logic based on user role and status changes
    const updateData = { ...body };

    // Prevent changing the church ID
    if (body.church && body.church !== user.church.toString()) {
      return NextResponse.json(
        { message: "Cannot change church affiliation" },
        { status: 400 }
      );
    }

    // Check if user can update this leave request
    // Only allow updates if status is pending or user created it
    if (existingLeave.status !== "pending" && existingLeave.createdBy.toString() !== user._id.toString()) {
      return NextResponse.json(
        { message: "Cannot update a leave request that is not pending" },
        { status: 403 }
      );
    }

    // Update the leave request
    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      leaveId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate("member", "name email phone")
      .populate("church", "name")
      .populate("createdBy", "name email");

    return NextResponse.json({
      message: "Leave request updated successfully",
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("PUT leave error:", error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a leave request
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const leaveId = await getLeaveId(params);

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    // Check if leave request exists and belongs to user's church
    const existingLeave = await LeaveRequest.findOne({
      _id: leaveId,
      church: user.church,
    });

    if (!existingLeave) {
      return NextResponse.json(
        { message: "Leave request not found in your church" },
        { status: 404 }
      );
    }

    // Check if user has permission to delete
    // Allow deletion if status is 'pending' or user is the creator
    if (
      existingLeave.status !== "pending" &&
      existingLeave.createdBy.toString() !== user._id.toString() &&
      !user.roles?.includes("admin") &&
      !user.roles?.includes("pastor")
    ) {
      return NextResponse.json(
        { message: "Cannot delete leave request that is not pending" },
        { status: 403 }
      );
    }

    // Delete the leave request
    await LeaveRequest.findByIdAndDelete(leaveId);

    return NextResponse.json({
      message: "Leave request deleted successfully",
    });
  } catch (error) {
    console.error("DELETE leave error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - For partial updates (e.g., approve/reject)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const leaveId = await getLeaveId(params);

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

    const body = await req.json();

    // Check if leave request exists and belongs to user's church
    const existingLeave = await LeaveRequest.findOne({
      _id: leaveId,
      church: user.church,
    });

    if (!existingLeave) {
      return NextResponse.json(
        { message: "Leave request not found in your church" },
        { status: 404 }
      );
    }

    // Check if user has permission to approve/reject
    const canApprove = user.roles?.some((role: string) =>
      ["admin", "pastor", "leader"].includes(role)
    );

    if (!canApprove && body.status && body.status !== "pending") {
      return NextResponse.json(
        { message: "You do not have permission to approve/reject leave requests" },
        { status: 403 }
      );
    }

    // Only allow status changes if it's currently pending
    if (existingLeave.status !== "pending" && body.status) {
      return NextResponse.json(
        { message: "Cannot change status of a leave request that is already processed" },
        { status: 400 }
      );
    }

    // Update the leave request
    const updatedLeave = await LeaveRequest.findByIdAndUpdate(
      leaveId,
      body,
      { new: true, runValidators: true }
    )
      .populate("member", "name email phone")
      .populate("church", "name")
      .populate("createdBy", "name email");

    return NextResponse.json({
      message: `Leave request ${body.status || "updated"} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("PATCH leave error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: "Validation error", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}