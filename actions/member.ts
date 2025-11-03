// src/actions/member.ts
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/models/Member';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createMember(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) throw new Error('Unauthorized');

  await connectToDatabase();

  const status = formData.get('status') === 'family' ? 'family' : 'single';

  const children: { firstName: string; lastName: string }[] = [];
  if (status === 'family') {
    const firstNames = formData
      .getAll('childFirstName')
      .filter(f => typeof f === 'string' && f.trim());
    const lastNames = formData
      .getAll('childLastName')
      .map(l => (typeof l === 'string' ? l.trim() : ''));

    for (let i = 0; i < firstNames.length; i++) {
      children.push({ firstName: firstNames[i] as string, lastName: lastNames[i] || '' });
    }
  }

  await Member.create({
    firstName: formData.get('firstName') as string,
    middleName: (formData.get('middleName') as string) || undefined,
    lastName: formData.get('lastName') as string,
    phone: (formData.get('phone') as string) || undefined,
    joinDate: new Date(formData.get('joinDate') as string),
    status,
    children,
    user: userId,
  });

  redirect('/member');
}

export async function updateMember(id: string) {
  await connectToDatabase();
  const updated = await Member.findByIdAndUpdate(id).lean();
  return JSON.parse(JSON.stringify(updated)); // Convert to plain object
}

export async function deleteMember(id: string) {
  await connectToDatabase();
  await Member.findByIdAndDelete(id);
  return { success: true };
}