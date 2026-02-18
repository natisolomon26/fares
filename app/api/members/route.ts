// app/api/members/route.ts - QUICK FIX
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

// GET: Fetch all members for the logged-in pastor

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

    // Get members for this pastor only
    const members = await Member.find({ pastorId: decoded.userId }).sort({
      createdAt: -1,
    });

    // Calculate comprehensive statistics
    const totalMembers = members.length;
    const totalChildren = members.reduce((acc, member) => 
      acc + (member.children?.length || 0), 0);
    const totalIndividuals = totalMembers + totalChildren;
    
    const familyCount = members.filter(m => m.isFamily === true).length;
    const singleCount = members.filter(m => m.isFamily === false).length;
    
    // Calculate children per family stats
    const familiesWithChildren = members.filter(m => m.isFamily && m.children?.length > 0);
    const totalFamiliesWithChildren = familiesWithChildren.length;
    const averageChildrenPerFamily = totalFamiliesWithChildren > 0 
      ? (totalChildren / totalFamiliesWithChildren).toFixed(1) 
      : 0;
    
    // Get max children in a single family
    const maxChildrenInFamily = members.reduce((max, member) => 
      Math.max(max, member.children?.length || 0), 0);

    return NextResponse.json({
      message: "Members fetched successfully",
      members,
      stats: {
        // Basic counts
        totalMembers,
        totalChildren,
        totalIndividuals,
        
        // Family stats
        familyCount,
        singleCount,
        familiesWithChildren: totalFamiliesWithChildren,
        familiesWithoutChildren: familyCount - totalFamiliesWithChildren,
        
        // Children stats
        averageChildrenPerFamily: Number(averageChildrenPerFamily),
        maxChildrenInFamily,
        totalChildrenCount: totalChildren,
        
        // Summary
        summary: `${totalMembers} member${totalMembers !== 1 ? 's' : ''} (${familyCount} family/${singleCount} single) with ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}`
      }
    });
  } catch (error) {
    console.error("GET members error:", error);
    return NextResponse.json(
      { message: "Failed to fetch members" },
      { status: 500 }
    );
  }
}

// POST: Create new member for the logged-in pastor
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

    // ✅ CORRECT: Use decoded.userId (NOT decoded.id)
    const pastor = await User.findById(decoded.userId);
    if (!pastor) {
      return NextResponse.json({ message: "User not found" }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, middleName, lastName, phone, isFamily, children } = body;

    // Validation
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Process children
    const processedChildren =
      isFamily && Array.isArray(children)
        ? children.map((c: any) => ({
            firstName: c.firstName,
            middleName: c.middleName || "",
            lastName: lastName,
          }))
        : [];

    // Create member
    const member = await Member.create({
      firstName,
      middleName: middleName || "",
      lastName,
      phone,
      isFamily: isFamily || false,
      children: processedChildren,
      pastorId: pastor._id, // ✅ Store pastor ID
      church: pastor.church, // ✅ Store church ID from pastor
    });

    return NextResponse.json(
      {
        message: "Member created successfully",
        member: {
          id: member._id,
          firstName: member.firstName,
          lastName: member.lastName,
          phone: member.phone,
          isFamily: member.isFamily,
          children: member.children,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST member error:", error);
    return NextResponse.json(
      { message: "Failed to create member" },
      { status: 500 }
    );
  }
}