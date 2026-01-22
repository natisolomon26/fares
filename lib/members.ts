// lib/members.ts
import { api } from "@/lib/api";
import { Member } from "@/types/member";

export async function getMembers(): Promise<Member[]> {
  const res = await api.get("/members");
  return res.data.members;
}
