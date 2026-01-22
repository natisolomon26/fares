import mongoose, { Schema, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["PASTOR"],
      default: "PASTOR",
      immutable: true,
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
  },
  { timestamps: true }
);

export default models.User || mongoose.model("User", UserSchema);
