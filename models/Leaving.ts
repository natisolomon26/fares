// models/Leaving.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ILeaving extends Document {
  memberId: mongoose.Types.ObjectId;
  churchId: mongoose.Types.ObjectId;
  pastorId: mongoose.Types.ObjectId;
  leavingDate: Date;
  issueDate: Date;
  reason: "transfer" | "relocation" | "personal" | "other";
  transferChurch?: string;
  notes?: string;
  certificateNumber: string;
  status: "active" | "revoked" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

// Generate certificate number function
async function generateCertificateNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Find the last certificate to get the next number
  const lastLeaving = await mongoose.models.Leaving
    .findOne({})
    .sort({ certificateNumber: -1 });
  
  let nextNumber = 1;
  if (lastLeaving && lastLeaving.certificateNumber) {
    const lastNumber = parseInt(lastLeaving.certificateNumber.split('-')[2]);
    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }
  
  return `LVC-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
}

const LeavingSchema = new Schema<ILeaving>(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    churchId: {
      type: Schema.Types.ObjectId,
      ref: "Church",
      required: true,
    },
    pastorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    leavingDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    issueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    reason: {
      type: String,
      enum: ["transfer", "relocation", "personal", "other"],
      required: true,
    },
    transferChurch: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Pre-validate hook to generate certificate number
LeavingSchema.pre("validate", async function(next) {
  if (!this.certificateNumber) {
    try {
      this.certificateNumber = await generateCertificateNumber();
      next();
    } catch (error) {
      next(error as Error);
    }
  } else {
    next();
  }
});

export default models.Leaving || model<ILeaving>("Leaving", LeavingSchema);