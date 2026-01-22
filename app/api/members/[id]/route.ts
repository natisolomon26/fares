import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import { getUserFromToken } from "@/lib/auth";

// ----------------- Helper: validate member ID -----------------
function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

// ----------------- Helper: fetch member with church check -----------------
async function findMember(userId: string, memberId: string) {
  const user = await getUserFromToken({ headers: { get: () => `Bearer ${userId}` } } as any);
  if (!user) return null;
  return Member.findOne({ _id: memberId, church: user.church }).populate("church");
}

// ----------------- GET MEMBER -----------------
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: memberId } = await params;

    if (!isValidObjectId(memberId)) {
      return NextResponse.json({ message: "Invalid member ID" }, { status: 400 });
    }

    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const member = await Member.findOne({ _id: memberId, church: user.church }).populate("church");

    if (!member) return NextResponse.json({ message: "Member not found" }, { status: 404 });

    return NextResponse.json({ member });
  } catch (error) {
    console.error("GET member error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ----------------- UPDATE MEMBER -----------------
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: memberId } = await params;

    if (!isValidObjectId(memberId)) {
      return NextResponse.json({ message: "Invalid member ID" }, { status: 400 });
    }

    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Ensure the member belongs to the user's church
    const existingMember = await Member.findOne({ _id: memberId, church: user.church });
    if (!existingMember) return NextResponse.json({ message: "Member not found" }, { status: 404 });

    // Prevent changing church affiliation
    if (body.church && body.church !== user.church.toString()) {
      return NextResponse.json({ message: "Cannot change church affiliation" }, { status: 400 });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      memberId,
      { ...body, church: user.church }, // Ensure church stays the same
      { new: true, runValidators: true }
    ).populate("church");

    return NextResponse.json({ message: "Member updated", member: updatedMember });
  } catch (error) {
    console.error("PUT member error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// ----------------- DELETE MEMBER -----------------
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id: memberId } = await params;

    if (!isValidObjectId(memberId)) {
      return NextResponse.json({ message: "Invalid member ID" }, { status: 400 });
    }

    const user = await getUserFromToken(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const existingMember = await Member.findOne({ _id: memberId, church: user.church });
    if (!existingMember) return NextResponse.json({ message: "Member not found" }, { status: 404 });

    await Member.findByIdAndDelete(memberId);

    return NextResponse.json({ message: "Member deleted" });
  } catch (error) {
    console.error("DELETE member error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
