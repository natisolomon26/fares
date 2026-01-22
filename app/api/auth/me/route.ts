// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  await connectToDatabase();

  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: user.church ? { id: user.church._id, name: user.church.name } : null,
    },
  });
}
