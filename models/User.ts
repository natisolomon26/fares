// src/models/User.ts
import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠️ hash in real app
  churchName: { type: String, required: true },
  role: { type: String, default: 'admin' },
}, {
  timestamps: true,
});

const User = models.User || model('User', userSchema);
export default User;