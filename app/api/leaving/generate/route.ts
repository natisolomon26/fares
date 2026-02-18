// app/api/leaving/generate/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Leaving from "@/models/Leaving";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
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

    const body = await req.json();
    const { leavingId } = body;

    if (!leavingId) {
      return NextResponse.json(
        { message: "Leaving certificate ID is required" },
        { status: 400 }
      );
    }

    const leaving = await Leaving.findById(leavingId)
      .populate("memberId")
      .populate("churchId")
      .populate("pastorId", "email");

    if (!leaving) {
      return NextResponse.json(
        { message: "Leaving certificate not found" },
        { status: 404 }
      );
    }

    // Format the certificate data for printing
    const certificate = {
      certificateNumber: leaving.certificateNumber,
      issueDate: leaving.issueDate,
      leavingDate: leaving.leavingDate,
      member: {
        fullName: `${leaving.memberId.firstName} ${leaving.memberId.middleName || ''} ${leaving.memberId.lastName}`.trim(),
        phone: leaving.memberId.phone,
        isFamily: leaving.memberId.isFamily,
        children: leaving.memberId.children || [],
      },
      church: {
        name: leaving.churchId.name,
        address: leaving.churchId.address || '',
        phone: leaving.churchId.phone || '',
        email: leaving.churchId.email || '',
      },
      reason: leaving.reason,
      transferChurch: leaving.transferChurch,
      notes: leaving.notes,
      status: leaving.status,
    };

    return NextResponse.json({
      message: "Certificate generated successfully",
      certificate,
    });
  } catch (error) {
    console.error("Generate certificate error:", error);
    return NextResponse.json(
      { message: "Failed to generate certificate" },
      { status: 500 }
    );
  }
}