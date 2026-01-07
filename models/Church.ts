// src/models/Church.ts
import { Schema, model, models } from "mongoose";

const churchSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    logo: { type: String }, // URL or path to logo
    description: { type: String },
  },
  { timestamps: true }
);

const Church = models.Church || model("Church", churchSchema);
export default Church;
