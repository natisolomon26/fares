// models/Church.ts
import mongoose, { Schema, models, model } from "mongoose";

const ChurchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Check if model exists, otherwise create it
const Church = models.Church || model("Church", ChurchSchema);

export default Church;