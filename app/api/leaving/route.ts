// app/api/leaving/route.ts - UPDATED POST METHOD WITH FIX 3
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Leaving from "@/models/Leaving";
import Member from "@/models/Member";
import User from "@/models/User";
import Church from "@/models/Church";
import { verifyToken } from "@/lib/auth";

// Helper function to generate certificate number
async function generateCertificateNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Find the last certificate to get the next number
  const lastLeaving = await Leaving.findOne({})
    .sort({ certificateNumber: -1 })
    .select('certificateNumber');
  
  let nextNumber = 1;
  if (lastLeaving && lastLeaving.certificateNumber) {
    // Extract the number part from certificate number (format: LVC-YYYYMM-XXXX)
    const parts = lastLeaving.certificateNumber.split('-');
    if (parts.length === 3) {
      const lastNumber = parseInt(parts[2]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }
  }
  
  return `LVC-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
}

// POST: Create a new leaving certificate
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

    // Get pastor details
    const pastor = await User.findById(decoded.userId);
    if (!pastor) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { 
      memberId, 
      leavingDate, 
      issueDate, 
      reason, 
      transferChurch, 
      notes 
    } = body;

    // Validation
    if (!memberId || !reason) {
      return NextResponse.json(
        { message: "Member ID and reason are required" },
        { status: 400 }
      );
    }

    // Check if member exists and belongs to this pastor's church
    const member = await Member.findOne({
      _id: memberId,
      church: pastor.church,
    });

    if (!member) {
      return NextResponse.json(
        { message: "Member not found or unauthorized" },
        { status: 404 }
      );
    }

    // Check if member already has an active leaving certificate
    const existingLeaving = await Leaving.findOne({
      memberId,
      status: "active",
    });

    if (existingLeaving) {
      return NextResponse.json(
        { message: "Member already has an active leaving certificate" },
        { status: 409 }
      );
    }

    // Generate certificate number
    const certificateNumber = await generateCertificateNumber();

    // Prepare leaving data with certificate number
    const leavingData: any = {
      memberId,
      churchId: pastor.church,
      pastorId: pastor._id,
      reason,
      status: "active",
      certificateNumber, // Add certificate number here
    };

    // Add optional fields if provided
    if (leavingDate) leavingData.leavingDate = new Date(leavingDate);
    if (issueDate) leavingData.issueDate = new Date(issueDate);
    if (reason === "transfer" && transferChurch) {
      leavingData.transferChurch = transferChurch;
    }
    if (notes) leavingData.notes = notes;

    // Create the leaving record
    const leaving = await Leaving.create(leavingData);

    // Populate the response
    await leaving.populate([
      { path: "memberId", select: "firstName middleName lastName phone isFamily children" },
      { path: "churchId", select: "name address phone email" },
      { path: "pastorId", select: "email" },
    ]);

    return NextResponse.json(
      {
        message: "Leaving certificate created successfully",
        leaving,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST leaving error:", error);
    
    // Handle duplicate certificate number error
    if (error.code === 11000 && error.keyPattern?.certificateNumber) {
      // Retry once with a new certificate number
      try {
        const newCertificateNumber = await generateCertificateNumber();
        error.data.certificateNumber = newCertificateNumber;
        // You could implement retry logic here
        return NextResponse.json(
          { message: "Certificate number conflict. Please try again." },
          { status: 409 }
        );
      } catch (retryError) {
        return NextResponse.json(
          { message: "Failed to generate unique certificate number" },
          { status: 500 }
        );
      }
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to create leaving certificate" },
      { status: 500 }
    );
  }
}

// GET: Fetch all leaving certificates for the pastor's church
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
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Build query
    const query: any = { churchId: pastor.church };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.leavingDate = {};
      if (startDate) query.leavingDate.$gte = new Date(startDate);
      if (endDate) query.leavingDate.$lte = new Date(endDate);
    }

    const leavings = await Leaving.find(query)
      .populate("memberId", "firstName middleName lastName phone isFamily children")
      .populate("pastorId", "email")
      .sort({ leavingDate: -1 });

    // Calculate statistics
    const stats = {
      total: leavings.length,
      active: leavings.filter(l => l.status === "active").length,
      transfer: leavings.filter(l => l.reason === "transfer").length,
      relocation: leavings.filter(l => l.reason === "relocation").length,
      personal: leavings.filter(l => l.reason === "personal").length,
      other: leavings.filter(l => l.reason === "other").length,
    };

    return NextResponse.json({
      message: "Leaving certificates fetched successfully",
      leavings,
      stats,
    });
  } catch (error) {
    console.error("GET leaving error:", error);
    return NextResponse.json(
      { message: "Failed to fetch leaving certificates" },
      { status: 500 }
    );
  }
}