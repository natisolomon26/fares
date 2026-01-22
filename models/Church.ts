import mongoose, { Schema, models } from "mongoose";

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

export default models.Church || mongoose.model("Church", ChurchSchema);
