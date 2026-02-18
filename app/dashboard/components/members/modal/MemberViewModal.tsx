// app/dashboard/members/components/MemberViewModal.tsx
'use client'

import { X, Phone, User, Calendar, Edit } from 'lucide-react'
import { Member } from '../../types/index'

interface MemberViewModalProps {
  member: Member | null
  onClose: () => void
  onEdit: (member: Member) => void
}

export default function MemberViewModal({ member, onClose, onEdit }: MemberViewModalProps) {
  if (!member) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Member Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Member Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {member.firstName.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {member.firstName} {member.middleName} {member.lastName}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                  {member.isFamily && (
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      Family
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </p>
                <p className="font-medium text-gray-800">
                  {new Date(member.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Last Updated
                </p>
                <p className="font-medium text-gray-800">
                  {new Date(member.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Children Section */}
            {member.isFamily && member.children.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Children ({member.children.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {member.children.map((child, index) => (
                    <div key={child._id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {child.firstName} {child.middleName} {child.lastName}
                        </p>
                        <p className="text-xs text-gray-500">Child</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Children Message */}
            {member.isFamily && member.children.length === 0 && (
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <User className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">No children registered for this family</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  onEdit(member)
                  onClose()
                }}
                className="flex-1 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Member
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}