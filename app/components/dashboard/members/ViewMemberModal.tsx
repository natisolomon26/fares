// src/components/dashboard/members/ViewMemberModal.tsx
"use client";

import Modal from "../ui/Modal";
import { User, Users, Calendar, Phone } from "lucide-react";
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
      <div className="space-y-5">
        {/* Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-text-primary text-lg">
              {member.firstName} {member.middleName} {member.lastName}
            </p>
            <p className="text-sm text-text-secondary capitalize">
              {member.status === 'family' ? 'Family' : 'Single'}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          {member.phone && (
            <div className="flex items-center gap-2 text-text-secondary">
              <Phone className="w-4 h-4" />
              <span>{member.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className="w-4 h-4" />
            <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Children (if family) */}
        {member.status === 'family' && member.children && member.children.length > 0 && (
          <div>
            <h4 className="font-medium text-text-primary flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              Children ({member.children.length})
            </h4>
            <div className="space-y-2">
              {member.children.map((child, idx) => (
                <div key={idx} className="text-text-secondary text-sm">
                  • {child.firstName} {child.lastName}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}