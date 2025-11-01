// src/components/dashboard/members/MembersTable.tsx
"use client";

import { useState } from "react";
import { Users, Eye, User } from "lucide-react";
import MemberModal from "./MembersModal";
import ViewMemberModal from "./ViewMemberModal";
import LeaveRequestModal from "./LeaveRequestModal";
import { Member } from "@/app/types/members";

interface NewMemberData {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  joinDate: string;
  status: 'single' | 'family';
  children?: { firstName: string; lastName: string }[];
}

interface MembersTableProps {
  initialMembers: Member[];
}

export default function MembersTable({ initialMembers }: MembersTableProps) {
  const [members] = useState<Member[]>(initialMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [leaveMember, setLeaveMember] = useState<Member | null>(null);

  const handleAddMember = (data: NewMemberData) => {
    console.log("Add member:", data);
    // TODO: API call
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
            <Users className="w-5 h-5" />
            Church Members
          </h2>
          <p className="text-text-secondary text-sm mt-1">
            Total: {members.length} members
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-text-secondary text-sm">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="p-4 font-medium text-text-primary">
                  {member.firstName} {member.lastName}
                  {member.middleName && ` ${member.middleName.charAt(0)}.`}
                </td>
                <td className="p-4 text-text-secondary">
                  {member.phone || "—"}
                </td>
                <td className="p-4 text-text-secondary">
                  {new Date(member.joinDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      member.status === "family"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {member.status === "family" ? "Family" : "Single"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMember(member)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <MemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
      />
      {viewMember && (
        <ViewMemberModal
          member={viewMember}
          isOpen={true}
          onClose={() => setViewMember(null)}
        />
      )}
      {leaveMember && (
        <LeaveRequestModal
          member={leaveMember}
          isOpen={true}
          onClose={() => setLeaveMember(null)}
        />
      )}
    </div>
  );
}