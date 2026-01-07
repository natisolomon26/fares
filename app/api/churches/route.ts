// src/app/api/churches/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Church from "@/models/Church";

export async function GET() {
  await connectToDatabase();

  const churches = await Church.find().sort({ name: 1 });
  return NextResponse.json({ churches });
}
