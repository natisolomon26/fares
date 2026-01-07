// src/app/api/members/register/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import { getUserFromRequest } from "@/lib/auth"; // JWT middleware helper

export async function POST(req: Request) {
  await connectToDatabase();

  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { firstName, middleName, lastName, phone, joinDate, status, children } = data;

  const member = await Member.create({
    firstName,
    middleName,
    lastName,
    phone,
    joinDate,
    status,
    children: status === "family" ? children : [],
    church: user.church,
    createdBy: user.id,
  });

  return NextResponse.json({ member });
}
