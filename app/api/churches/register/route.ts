// src/app/api/churches/register/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Church from "@/models/Church";

export async function POST(req: Request) {
  await connectToDatabase();

  const { name, address, phone, email, logo, description } = await req.json();

  if (!name) {
    return NextResponse.json({ message: "Church name is required" }, { status: 400 });
  }

  const existing = await Church.findOne({ name });
  if (existing) {
    return NextResponse.json({ message: "Church already exists" }, { status: 409 });
  }

  const church = await Church.create({ name, address, phone, email, logo, description });

  return NextResponse.json({ message: "Church created", church });
}
