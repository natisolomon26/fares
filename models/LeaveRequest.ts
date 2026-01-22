// src/models/LeaveRequest.ts
import { Schema, model, models, Types } from "mongoose";

const leaveRequestSchema = new Schema(
  {
    member: { type: Types.ObjectId, ref: "Member", required: true },
    church: { type: Types.ObjectId, ref: "Church", required: true },
    type: { type: String, enum: ["sick", "personal", "vacation"], required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdBy: { type: Types.ObjectId, ref: "User", required: true }, // Admin who created
  },
  { timestamps: true }
);

const LeaveRequest = models.LeaveRequest || model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
