// src/app/api/members/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Member from "@/models/Member";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const updated = await Member.findOneAndUpdate(
    { _id: params.id, church: user.church },
    data,
    { new: true }
  );

  return NextResponse.json({ member: updated });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await Member.findOneAndDelete({ _id: params.id, church: user.church });
  return NextResponse.json({ message: "Member deleted successfully" });
}
