// src/app/api/members/route.ts
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/models/Members';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // TODO: Add auth check (get userId from session/cookie)
  const body = await request.json();
  
  await connectToDatabase();
  const member = await Member.create(body);
  
  return Response.json(member, { status: 201 });
}