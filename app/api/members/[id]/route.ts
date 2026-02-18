// app/api/members/[id]/route.ts - UPDATED FOR NEXT.JS 15
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import { verifyToken } from "@/lib/auth";
import { Types } from "mongoose";

// GET: Fetch a single member by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Note: params is now a Promise
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

    // Await the params
    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Find member and ensure it belongs to the logged-in pastor
    const member = await Member.findOne({
      _id: id,
      pastorId: decoded.userId,
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Member fetched successfully",
      member,
    });
  } catch (error) {
    console.error("GET member by ID error:", error);
    return NextResponse.json(
      { message: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

// PATCH: Update a member
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated type
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

    // Await the params
    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { firstName, middleName, lastName, phone, isFamily, children } = body;

    // Find member and ensure it belongs to the logged-in pastor
    const member = await Member.findOne({
      _id: id,
      pastorId: decoded.userId,
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (firstName) member.firstName = firstName;
    if (middleName !== undefined) member.middleName = middleName;
    if (lastName) member.lastName = lastName;
    if (phone) member.phone = phone;
    if (isFamily !== undefined) member.isFamily = isFamily;
    
    // Process children if provided
    if (children && Array.isArray(children)) {
      member.children = children.map((c: any) => ({
        firstName: c.firstName,
        middleName: c.middleName || "",
        lastName: c.lastName || member.lastName,
      }));
    }

    await member.save();

    return NextResponse.json({
      message: "Member updated successfully",
      member,
    });
  } catch (error) {
    console.error("PATCH member error:", error);
    return NextResponse.json(
      { message: "Failed to update member" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a member
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Updated type
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

    // Await the params
    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid member ID" },
        { status: 400 }
      );
    }

    // Find and delete member, ensuring it belongs to the logged-in pastor
    const member = await Member.findOneAndDelete({
      _id: id,
      pastorId: decoded.userId,
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Member deleted successfully",
    });
  } catch (error) {
    console.error("DELETE member error:", error);
    return NextResponse.json(
      { message: "Failed to delete member" },
      { status: 500 }
    );
  }
}