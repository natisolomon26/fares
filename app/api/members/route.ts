import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserFromToken(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);
    return user;
  } catch {
    return null;
  }
}

// ---------------- CREATE MEMBER ----------------
// ---------------- CREATE MEMBER ----------------
export async function POST(req: Request) {
  await connectToDatabase();
  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();

    // Validate required fields
    if (!data.firstName?.trim()) {
      return NextResponse.json({ message: "First name is required" }, { status: 400 });
    }
    
    if (!data.lastName?.trim()) {
      return NextResponse.json({ message: "Last name is required" }, { status: 400 });
    }

    // Validate and normalize gender
    if (!data.gender || !["male", "female"].includes(data.gender.toLowerCase().trim())) {
      return NextResponse.json(
        { message: "Gender is required and must be 'male' or 'female'" },
        { status: 400 }
      );
    }
    data.gender = data.gender.toLowerCase().trim();

    // Validate children if they exist
    if (data.children && Array.isArray(data.children)) {
      for (let i = 0; i < data.children.length; i++) {
        const child = data.children[i];
        
        if (!child.firstName?.trim()) {
          return NextResponse.json(
            { message: `Child ${i + 1} first name is required` },
            { status: 400 }
          );
        }
        
        if (!child.lastName?.trim()) {
          return NextResponse.json(
            { message: `Child ${i + 1} last name is required` },
            { status: 400 }
          );
        }
        
        if (!child.gender || !["male", "female"].includes(child.gender.toLowerCase().trim())) {
          return NextResponse.json(
            { message: `Child ${i + 1} gender is required and must be 'male' or 'female'` },
            { status: 400 }
          );
        }
        
        // Normalize child gender
        data.children[i].gender = child.gender.toLowerCase().trim();
      }
    }

    // Validate status if provided
    if (data.status && !["single", "family"].includes(data.status.toLowerCase().trim())) {
      return NextResponse.json(
        { message: "Status must be 'single' or 'family'" },
        { status: 400 }
      );
    }
    if (data.status) {
      data.status = data.status.toLowerCase().trim();
    }

    // Create the member
    const member = await Member.create({
      ...data,
      church: user.church,
    });

    return NextResponse.json({ 
      message: "Member created successfully", 
      member 
    }, { status: 201 });

  } catch (error) {
    console.error("Create member error:", error);
    
    // Handle Mongoose validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Member with similar details already exists" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------- GET ALL MEMBERS ----------------
export async function GET(req: Request) {
  await connectToDatabase();

  const user = await getUserFromToken(req);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const members = await Member.find({ church: user.church })
    .sort({ joinDate: -1 })
    .lean();

  // Initialize counters
  let totalAdultMembers = members.length;
  let totalChildren = 0;
  let totalMale = 0;
  let totalFemale = 0;
  let totalGenderUnknown = 0;
  let membersWithoutGender = 0;

  members.forEach((member) => {
    // Check if gender exists and is valid
    if (member.gender && typeof member.gender === 'string') {
      const genderLower = member.gender.toLowerCase().trim();
      if (genderLower === "male") {
        totalMale += 1;
      } else if (genderLower === "female") {
        totalFemale += 1;
      } else {
        console.log(`Invalid gender value: "${member.gender}" for member ${member._id}`);
        totalGenderUnknown += 1;
        membersWithoutGender += 1;
      }
    } else {
      console.log(`Missing or invalid gender for member: ${member._id}`);
      totalGenderUnknown += 1;
      membersWithoutGender += 1;
    }

    // Count children
    if (Array.isArray(member.children)) {
      totalChildren += member.children.length;
      
      member.children.forEach((child, index) => {
        if (child.gender && typeof child.gender === 'string') {
          const childGenderLower = child.gender.toLowerCase().trim();
          if (childGenderLower === "male") {
            totalMale += 1;
          } else if (childGenderLower === "female") {
            totalFemale += 1;
          } else {
            console.log(`Invalid child gender: "${child.gender}" for child ${index} of member ${member._id}`);
            totalGenderUnknown += 1;
          }
        } else {
          console.log(`Missing child gender for child ${index} of member ${member._id}`);
          totalGenderUnknown += 1;
        }
      });
    }
  });

  const totalAllMembers = totalAdultMembers + totalChildren;

  return NextResponse.json({
    members,
    stats: {
      totalAllMembers,
      totalAdultMembers,
      totalChildren,
      totalMale,
      totalFemale,
      totalGenderUnknown,
      membersWithoutGender,
      validation: {
        totalCounted: totalMale + totalFemale + totalGenderUnknown,
        expectedTotal: totalAllMembers,
        matches: (totalMale + totalFemale + totalGenderUnknown) === totalAllMembers
      }
    },
    warnings: membersWithoutGender > 0 ? 
      `${membersWithoutGender} adult members are missing gender information` : 
      null
  });
}