import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // <-- use this
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  await connectToDatabase();

  const token = (await cookies()).get("churchflow_token")?.value;
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

  const user = await User.findById(decoded.id).populate("church");
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      church: user.church
        ? { id: user.church._id, name: user.church.name }
        : null,
    },
  });
}
