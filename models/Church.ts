import { Schema, model, models } from "mongoose";

const churchSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String },
  },
  { timestamps: true }
);

const Church = models.Church || model("Church", churchSchema);
export default Church;
