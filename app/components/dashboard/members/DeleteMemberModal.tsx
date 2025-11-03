"use client";

import Modal from "../ui/Modal";
import { Member } from "@/app/types/members";
import { Trash2 } from "lucide-react";

interface DeleteMemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (memberId: string) => void;
}

export default function DeleteMemberModal({ member, isOpen, onClose, onDelete }: DeleteMemberModalProps) {
  const handleDelete = () => {
    onDelete(member._id);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Member">
      <div className="space-y-4 text-center">
        <Trash2 className="mx-auto w-10 h-10 text-red-500" />
        <p className="text-text-primary font-medium text-lg">
          Are you sure you want to delete <br /> <span className="font-bold">{member.firstName} {member.lastName}</span>?
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onClose} className="px-5 py-2.5 border rounded-lg text-text-secondary">
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
