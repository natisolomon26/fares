// src/actions/member.ts
'use server';

import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/models/Members';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createMember(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;
  const status = formData.get('status');
  console.log('Received status:', status, typeof status); // Should be 'single' or 'family'
  

  if (!userId) {
    throw new Error('Unauthorized');
  }

  await connectToDatabase();

  // Build children array safely
  const children: { firstName: string; lastName: string }[] = [];
  if (formData.get('status') === 'family') {
    const firstNames = formData.getAll('childFirstName').filter(f => typeof f === 'string' && f.trim());
    const lastNames = formData.getAll('childLastName').map(l => (typeof l === 'string' ? l.trim() : ''));
    
    for (let i = 0; i < firstNames.length; i++) {
      children.push({
        firstName: firstNames[i] as string,
        lastName: lastNames[i] || '',
      });
    }
  }

  const memberData = {
    firstName: formData.get('firstName') as string,
    middleName: formData.get('middleName') as string || undefined,
    lastName: formData.get('lastName') as string,
    phone: formData.get('phone') as string || undefined,
    joinDate: new Date(formData.get('joinDate') as string),
    status: formData.get('status') === 'family' ? 'family' : 'single',
    children,
    user: userId,
  };

  await Member.create(memberData);
  redirect('/dashboard/members'); // Refreshes the page with new data
}