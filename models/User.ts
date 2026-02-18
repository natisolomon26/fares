// Updated User model
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "PASTOR";
  church: mongoose.Types.ObjectId; // Changed to ObjectId
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
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
    },
    church: {
      type: Schema.Types.ObjectId,
      ref: "Church", // References a Church model
      required: true,
    },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);