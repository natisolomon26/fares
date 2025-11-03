"use client";

import { useEffect, useReducer } from "react";
import Modal from "../ui/Modal";
import { UserPlus, Calendar, Phone, User } from "lucide-react";
import { Member } from "@/app/types/members";
import { updateMember } from "@/actions/member"; // You’ll create this server action

interface UpdateMemberModalProps {
  member: Member;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedMember: Member) => void;
}

// Form state reducer
type Action =
  | { type: "SET_FIELD"; field: string; value: string }
  | { type: "SET_STATUS"; status: "single" | "family" };

interface State {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  joinDate: string;
  status: "single" | "family";
}

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_STATUS":
      return { ...state, status: action.status };
    default:
      return state;
  }
}

export default function UpdateMemberModal({
  member,
  isOpen,
  onClose,
  onUpdate,
}: UpdateMemberModalProps) {
  const [state, dispatch] = useReducer(formReducer, {
    firstName: member.firstName,
    middleName: member.middleName || "",
    lastName: member.lastName,
    phone: member.phone || "",
    joinDate: new Date(member.joinDate).toISOString().split("T")[0],
    status: member.status,
  });

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: "SET_FIELD", field: "joinDate", value: new Date(member.joinDate).toISOString().split("T")[0] });
    }
  }, [isOpen, member.joinDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FIELD", field: e.target.name, value: e.target.value });
  };

  const handleStatusChange = (status: "single" | "family") => {
    dispatch({ type: "SET_STATUS", status });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call server action to update
    const updatedMember = await updateMember(member._id);

    // Update state in parent table
    onUpdate(updatedMember);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Member">
      <form onSubmit={handleSubmit} className="space-y-6 p-5">
        {/* Name Section */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-medium text-text-primary flex items-center gap-2 mb-3">
            <User className="w-4 h-4" />
            Full Name
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="firstName"
              value={state.firstName}
              onChange={handleChange}
              required
              className="px-4 py-2.5 border border-gray-200 rounded-lg"
              placeholder="First Name *"
            />
            <input
              name="middleName"
              value={state.middleName}
              onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg"
              placeholder="Middle Name"
            />
            <input
              name="lastName"
              value={state.lastName}
              onChange={handleChange}
              required
              className="px-4 py-2.5 border border-gray-200 rounded-lg"
              placeholder="Last Name *"
            />
          </div>
        </div>

        {/* Contact & Join Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              name="phone"
              value={state.phone}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg"
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              name="joinDate"
              type="date"
              value={state.joinDate}
              onChange={handleChange}
              required
              className="w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg"
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-medium text-text-primary mb-3">Membership Type</h3>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => handleStatusChange("single")}
              className={`flex-1 py-3 rounded-lg border ${
                state.status === "single"
                  ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                  : "bg-white border-gray-200"
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("family")}
              className={`flex-1 py-3 rounded-lg border ${
                state.status === "family"
                  ? "bg-blue-100 border-blue-500 text-blue-700 font-medium"
                  : "bg-white border-gray-200"
              }`}
            >
              Family
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-text-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Update Member
          </button>
        </div>
      </form>
    </Modal>
  );
}
