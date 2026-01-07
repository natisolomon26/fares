// src/lib/auth.ts
import { verifyToken } from "./jwt";
import User from "@/models/User";
import { connectToDatabase } from "./mongodb";

export async function getUserFromRequest(req: Request) {
  await connectToDatabase();

  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;

  try {
    const token = auth.split(" ")[1];
    const decoded: any = verifyToken(token);

    const user = await User.findById(decoded.sub);
    if (!user) return null;

    return {
      id: user._id.toString(),
      role: user.role,
      church: user.churchName, // or church _id if you link churches
    };
  } catch {
    return null;
  }
}
