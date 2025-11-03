// app/dashboard/members/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongodb';
import Member from '@/models/Member';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import MembersTable from '@/app/components/dashboard/members/MembersTable';
import MemberSummaryCards from '@/app/components/dashboard/members/MemberSummaryCard';

export default async function MembersPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    redirect('/login');
  }

  await connectToDatabase();
  const members = await Member.find({ user: userId }).lean();

  const total = members.length;
  const single = members.filter((m) => m.status === 'single').length;
  const family = members.filter((m) => m.status === 'family').length;

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8">
        {/* Summary Cards */}
        <MemberSummaryCards total={total} single={single} family={family} />

        {/* Members Table */}
        <MembersTable 
          initialMembers={JSON.parse(JSON.stringify(members))} 
        />
      </div>
    </DashboardLayout>
  );
}
