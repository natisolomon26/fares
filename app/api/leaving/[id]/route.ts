// app/api/leaving/[id]/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Leaving from "@/models/Leaving";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

// GET: Fetch a single leaving certificate by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid leaving certificate ID" },
        { status: 400 }
      );
    }

    const leaving = await Leaving.findOne({
      _id: id,
      churchId: pastor.church,
    })
      .populate("memberId", "firstName middleName lastName phone isFamily children")
      .populate("churchId", "name address phone email")
      .populate("pastorId", "email");

    if (!leaving) {
      return NextResponse.json(
        { message: "Leaving certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Leaving certificate fetched successfully",
      leaving,
    });
  } catch (error) {
    console.error("GET leaving by ID error:", error);
    return NextResponse.json(
      { message: "Failed to fetch leaving certificate" },
      { status: 500 }
    );
  }
}

// PATCH: Update a leaving certificate
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid leaving certificate ID" },
        { status: 400 }
      );
    }

    const leaving = await Leaving.findOne({
      _id: id,
      churchId: pastor.church,
    });

    if (!leaving) {
      return NextResponse.json(
        { message: "Leaving certificate not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { status, notes, transferChurch, reason } = body;

    // Update allowed fields
    if (status && ["active", "revoked", "archived"].includes(status)) {
      leaving.status = status;
    }
    
    if (notes !== undefined) {
      leaving.notes = notes;
    }
    
    if (reason && ["transfer", "relocation", "personal", "other"].includes(reason)) {
      leaving.reason = reason;
    }
    
    if (transferChurch !== undefined) {
      leaving.transferChurch = transferChurch;
    }

    await leaving.save();
    await leaving.populate([
      { path: "memberId", select: "firstName middleName lastName phone isFamily children" },
      { path: "churchId", select: "name address phone email" },
      { path: "pastorId", select: "email" },
    ]);

    return NextResponse.json({
      message: "Leaving certificate updated successfully",
      leaving,
    });
  } catch (error) {
    console.error("PATCH leaving error:", error);
    return NextResponse.json(
      { message: "Failed to update leaving certificate" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid leaving certificate ID" },
        { status: 400 }
      );
    }

    const leaving = await Leaving.findOneAndDelete({
      _id: id,
      churchId: pastor.church,
    });

    if (!leaving) {
      return NextResponse.json(
        { message: "Leaving certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Leaving certificate deleted successfully",
    });
  } catch (error) {
    console.error("DELETE leaving error:", error);
    return NextResponse.json(
      { message: "Failed to delete leaving certificate" },
      { status: 500 }
    );
  }
}

