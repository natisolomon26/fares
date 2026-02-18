// models/Member.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChild {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IMember extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  isFamily: boolean;
  children: IChild[];
  // Make sure this field exists in your schema
  church: mongoose.Types.ObjectId; // This should be in your schema
  pastorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChildSchema = new Schema<IChild>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

const MemberSchema = new Schema<IMember>(
  {
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    isFamily: { type: Boolean, default: false },
    children: { type: [ChildSchema], default: [] },
    // Make sure this field exists with the correct reference
    church: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Church", // This reference is crucial for populate to work
      required: true 
    },
    pastorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);