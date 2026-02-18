// app/dashboard/members/components/MembersHeader.tsx
'use client'

import { UserPlus } from 'lucide-react'

interface MembersHeaderProps {
  onAddClick: () => void
  totalMembers: number
}

export default function MembersHeader({ onAddClick, totalMembers }: MembersHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Members Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your church members and their families
          </p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add New Member
        </button>
      </div>
    </div>
  )
}