// src/app/api/churches/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Church from "@/models/Church";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const data = await req.json();

  const church = await Church.findByIdAndUpdate(params.id, data, { new: true });

  if (!church) {
    return NextResponse.json({ message: "Church not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Church updated", church });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const church = await Church.findByIdAndDelete(params.id);

  if (!church) {
    return NextResponse.json({ message: "Church not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Church deleted" });
}
