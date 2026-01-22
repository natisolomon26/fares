// src/lib/auth.ts
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Church from "@/models/Church";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

export async function getUserFromToken(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId).populate("church");
    return user;
  } catch (err) {
    return null;
  }
}
