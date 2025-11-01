// src/actions/auth.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { hash, compare } from 'bcrypt';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  churchName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ✅ Define action return type
export type AuthResult = 
  | { success: true }
  | { success: false; message: string };

export async function signUp(
  _: any,
  formData: FormData
): Promise<AuthResult> {
  await connectToDatabase();

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    churchName: formData.get('churchName') as string,
  };

  const validated = signupSchema.safeParse(raw);
  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }

  const { email, password, churchName } = validated.data;

  const existing = await User.findOne({ email });
  if (existing) {
    return { success: false, message: "Email already in use" };
  }

  const hashed = await hash(password, 10);
  await User.create({ email, password: hashed, churchName });

  const cookieStore = await cookies();
  // Note: We don't have user._id here yet — fix:
  const newUser = await User.findOne({ email });
  cookieStore.set('user_id', newUser!._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/login'); // ✅ This ends the function — no return
}

export async function signIn(
  _: any,
  formData: FormData
): Promise<AuthResult> {
  await connectToDatabase();

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validated = loginSchema.safeParse(raw);
  if (!validated.success) {
    return { success: false, message: validated.error.issues[0].message };
  }

  const { email, password } = validated.data;
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, message: "Invalid credentials" };
  }

  const valid = await compare(password, user.password);
  if (!valid) {
    return { success: false, message: "Invalid credentials" };
  }

  const cookieStore = await cookies();
  cookieStore.set('user_id', user._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/dashboard');
}