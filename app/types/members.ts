// src/types/member.ts
export interface Child {
  firstName: string;
  lastName: string;
  age?: number;
}

export interface Member {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  joinDate: string; // ISO date string
  status: 'single' | 'family';
  children: Child[];
  user: string;
  createdAt?: string;
  updatedAt?: string;
}