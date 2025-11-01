// src/models/Member.ts
import { Schema, model, models } from 'mongoose';

// Child sub-schema
const childSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, min: 0, max: 120 },
}, { _id: false }); // Disable _id for subdocs

const memberSchema = new Schema({
  firstName: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  middleName: { 
    type: String, 
    trim: true,
    maxlength: 100
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: 1,
    maxlength: 100
  },
  phone: { 
    type: String, 
    trim: true,
    match: [/^\+?[\d\s\-\(\)]{7,15}$/, 'Invalid phone number']
  },
  joinDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  status: { 
    type: String, 
    enum: ['single', 'family'], // ← must be lowercase
    default: 'single'
  },
  children: [childSchema],
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, {
  timestamps: true, // adds createdAt, updatedAt
});

const Member = models.Member || model('Member', memberSchema);
export default Member;