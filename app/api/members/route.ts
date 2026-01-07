// src/app/api/members/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  await connectToDatabase();

  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const members = await Member.find({ church: user.church }).sort({ joinDate: -1 });
  return NextResponse.json({ members });
}
