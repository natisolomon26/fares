// src/components/dashboard/members/ViewMemberModal.tsx
"use client";

import Modal from "../ui/Modal";
import { Users, Calendar, Phone } from "lucide-react";
import { Member } from "@/app/types/members";

interface ViewMemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewMemberModal({ member, isOpen, onClose }: ViewMemberModalProps) {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Member Details">
      <div className="space-y-6">
        {/* Header: Avatar & Name */}
        <div className="flex items-center gap-4 border-b pb-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
          </div>
          <div>
            <p className="text-xl font-semibold text-text-primary">
              {member.firstName} {member.middleName} {member.lastName}
            </p>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium mt-1 inline-block ${
                member.status === "family" 
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {member.status === "family" ? "Family" : "Single"}
            </span>
          </div>
        </div>

        {/* Contact & Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary text-sm">
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{member.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Children Section */}
        {member.status === "family" && member.children && member.children.length > 0 && (
          <div>
            <h4 className="text-text-primary font-medium flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              Children ({member.children.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {member.children.map((child, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {child.firstName} {child.lastName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
