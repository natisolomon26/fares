// src/components/dashboard/members/LeaveRequestModal.tsx
import Modal from "../ui/Modal";
import { useState } from "react";
import { Member } from "@/app/types/members"; // ✅ Import type

interface LeaveRequestModalProps {
  member: Member; // ✅ Strongly typed
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveRequestModal({ member, isOpen, onClose }: LeaveRequestModalProps) {
  const [reason, setReason] = useState("");
  const [newChurch, setNewChurch] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Leave request:", { memberId: member._id, reason, newChurch });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Submit Leave Request">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-text-secondary">
          Submitting a leave request for <span className="font-medium">{member.firstName} {member.lastName}</span>.
        </p>
        <textarea
          placeholder="Reason for leaving (required)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
          rows={3}
          required
        />
        <input
          type="text"
          placeholder="New church (optional)"
          value={newChurch}
          onChange={(e) => setNewChurch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
        />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-text-secondary">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium">
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
}