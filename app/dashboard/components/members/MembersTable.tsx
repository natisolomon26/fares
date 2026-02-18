// app/dashboard/members/components/MembersTable.tsx
'use client'

import { Phone, Eye, Edit, Trash2, User } from 'lucide-react'
import { Member } from '../types'

interface MembersTableProps {
  members: Member[]
  onView: (member: Member) => void
  onEdit: (member: Member) => void
  onDelete: (id: string) => void
}

export default function MembersTable({ members, onView, onEdit, onDelete }: MembersTableProps) {
  if (members.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No members found</h3>
        <p className="text-gray-500">Get started by adding your first member</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Phone</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {member.firstName} {member.lastName}
                      </p>
                      {member.middleName && (
                        <p className="text-sm text-gray-600">{member.middleName}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {member.isFamily ? (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                      Family ({member.children.length} children)
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      Individual
                    </span>
                  )}
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(member.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(member)}
                      className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}