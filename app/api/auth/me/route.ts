// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Church from "@/models/Church";
import { verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  await connectToDatabase();

  // Try different ways to get cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('churchflow_token')?.value;

  // Also check the request headers as fallback
  const authHeader = request.headers.get('authorization');
  let tokenFromHeader = null;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    tokenFromHeader = authHeader.substring(7);
  }

  const finalToken = token || tokenFromHeader;

  if (!finalToken) {
    console.log('No token found in cookies or headers');
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = verifyToken(finalToken);
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).populate("church");
    if (!user) {
      console.log('User not found in database:', decoded.id);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

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
  } catch (error: unknown) {
  console.error("Login error:", error);

  // Narrow error to Error type
  const message = error instanceof Error ? error.message : String(error);

  return NextResponse.json({ 
    message: "Login failed", 
    error: message
  }, { status: 500 });
}
}