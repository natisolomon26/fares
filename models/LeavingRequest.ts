// src/models/LeavingRequest.ts
import { Schema, model, models } from 'mongoose';

const leavingRequestSchema = new Schema({
  member: { 
    type: Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  reason: { type: String, required: true },
  newChurch: { type: String },
  requestedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'declined'], 
    default: 'pending' 
  },
  notes: { type: String },
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
});

const LeavingRequest = models.LeavingRequest || model('LeavingRequest', leavingRequestSchema);
export default LeavingRequest;