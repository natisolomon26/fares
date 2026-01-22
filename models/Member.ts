// src/models/Member.ts
import { Schema, model, models, Types } from "mongoose";
// src/models/Member.ts
const memberSchema = new Schema(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    phone: { type: String },
    joinDate: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["single", "family"],
      default: "single",
    },

    children: [
      {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        gender: {
          type: String,
          enum: ["male", "female"],
          required: true,
        },
      },
    ],

    church: { type: Types.ObjectId, ref: "Church", required: true },
  },
  { timestamps: true }
);

const Member = models.Member || model("Member", memberSchema);
export default Member;
