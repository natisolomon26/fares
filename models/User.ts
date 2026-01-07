// src/models/User.ts
import { Schema, model, models, Types } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    church: { type: Types.ObjectId, ref: "Church", required: true }, // Must be ObjectId
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);
export default User;
