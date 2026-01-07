// src/models/Member.ts
import { Schema, model, models, Types } from "mongoose";

const childSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const memberSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phone: { type: String },
    joinDate: { type: Date, required: true },
    status: { type: String, enum: ["single", "family"], default: "single" },
    children: [childSchema],
    church: { type: Types.ObjectId, ref: "Church", required: true }, // link to Church
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Member = models.Member || model("Member", memberSchema);
export default Member;
