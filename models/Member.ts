// src/models/Member.ts
import { Schema, model, models } from 'mongoose';

const childSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, min: 0, max: 120 },
  },
  { _id: false }
);

const memberSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number'],
    },
    joinDate: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['single', 'family'], default: 'single' },
    children: [childSchema],
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Member = models.Member || model('Member', memberSchema);
export default Member;
