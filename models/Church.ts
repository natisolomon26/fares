// models/Church.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IChurch extends Document {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  pastor: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChurchSchema = new Schema<IChurch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    pastor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Church || model<IChurch>("Church", ChurchSchema);