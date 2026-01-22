// lib/leaves.ts
import { api, setAuthToken } from "@/lib/api";
import { Leave } from "@/types/leaves";

// Optionally set token before calling these functions
export function setLeavesAuth(token: string | null) {
  setAuthToken(token);
}

// Get all leaves
export async function getLeaves(): Promise<Leave[]> {
  const res = await api.get("/leaves");
  // API returns { leaves: [...] }
  return res.data.leaves;
}

// Get a leave by ID
export async function getLeaveById(id: string): Promise<Leave> {
  const res = await api.get(`/leaves/${id}`);
  // API returns { leave: {...} }
  return res.data.leave;
}

// Create a new leave request
export async function createLeave(leaveData: {
  memberId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
}): Promise<Leave> {
  const res = await api.post("/leaves", leaveData);
  return res.data.leaveRequest; // matches your backend response
}

// Update leave request (optional)
export async function updateLeave(id: string, updates: Partial<Leave>): Promise<Leave> {
  const res = await api.put(`/leaves/${id}`, updates);
  return res.data.leaveRequest;
}

// Delete leave request (optional)
export async function deleteLeave(id: string): Promise<{ message: string }> {
  const res = await api.delete(`/leaves/${id}`);
  return res.data;
}
