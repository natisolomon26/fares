"use client";

import { useState } from "react";
import { Users, Eye, User, Edit, Trash2 } from "lucide-react";
import MemberModal from "./MemberModal";
import ViewMemberModal from "./ViewMemberModal";
import UpdateMemberModal from "./UpdateMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";
import { Member } from "@/app/types/members";

interface MembersTableProps {
  initialMembers: Member[];
}

export default function MembersTable({ initialMembers }: MembersTableProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [updateMember, setUpdateMember] = useState<Member | null>(null);
  const [deleteMember, setDeleteMember] = useState<Member | null>(null);

  // Add new member to the state
  const handleAddMember = (newMember: Member) => {
    setMembers([newMember, ...members]);
  };

  // Update existing member
  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(members.map((m) => (m._id === updatedMember._id ? updatedMember : m)));
  };

  // Delete member
  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter((m) => m._id !== memberId));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header with Add Member */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <Users className="w-5 h-5" />
          Church Members
        </h2>
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
              <th className="p-4 text-left">No</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map((member, idx) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="p-4">{idx + 1}</td>
                <td className="p-4 font-medium text-text-primary">
                  {member.firstName} {member.lastName}
                  {member.middleName && ` ${member.middleName.charAt(0)}.`}
                </td>
                <td className="p-4 text-text-secondary">{member.phone || "—"}</td>
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
                <td className="p-4 text-text-secondary">
                  {new Date(member.joinDate).toLocaleDateString()}
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
                    <button
                      onClick={() => setUpdateMember(member)}
                      className="p-2 text-gray-500 hover:text-primary-600 rounded-full hover:bg-primary-50"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteMember(member)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
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
      {updateMember && (
        <UpdateMemberModal
          member={updateMember}
          isOpen={true}
          onClose={() => setUpdateMember(null)}
          onUpdate={handleUpdateMember}
        />
      )}
      {deleteMember && (
        <DeleteMemberModal
          member={deleteMember}
          isOpen={true}
          onClose={() => setDeleteMember(null)}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
}
