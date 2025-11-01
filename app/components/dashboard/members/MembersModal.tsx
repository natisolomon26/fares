// src/components/dashboard/members/MemberModal.tsx
"use client";

import { useFormState, useFormStatus } from 'react-dom';
import Modal from "../ui/Modal";
import { UserPlus, Calendar, Phone, User } from "lucide-react";
import { useEffect, useReducer } from 'react';
import { createMember } from '@/actions/member';

// Form state reducer
type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'ADD_CHILD' }
  | { type: 'REMOVE_CHILD'; index: number }
  | { type: 'UPDATE_CHILD'; index: number; field: 'firstName' | 'lastName'; value: string }
  | { type: 'SET_STATUS'; status: 'single' | 'family' };

interface State {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  joinDate: string;
  status: 'single' | 'family';
  children: { firstName: string; lastName: string }[];
}

const initialState: State = {
  firstName: "",
  middleName: "",
  lastName: "",
  phone: "",
  joinDate: new Date().toISOString().split("T")[0],
  status: "single",
  children: [],
};

function formReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_STATUS':
      return { ...state, status: action.status, children: action.status === 'single' ? [] : state.children };
    case 'ADD_CHILD':
      return { ...state, children: [...state.children, { firstName: "", lastName: "" }] };
    case 'REMOVE_CHILD':
      return { ...state, children: state.children.filter((_, i) => i !== action.index) };
    case 'UPDATE_CHILD':
      return {
        ...state,
        children: state.children.map((child, i) =>
          i === action.index ? { ...child, [action.field]: action.value } : child
        ),
      };
    default:
      return state;
  }
}

// Submit button with loading
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors disabled:opacity-70"
    >
      {pending ? 'Adding...' : 'Add Member'}
      <UserPlus className="w-4 h-4" />
    </button>
  );
}

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export default function MemberModal({ isOpen, onClose }: MemberModalProps) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Reset form when opened
    useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'SET_FIELD', field: 'joinDate', value: new Date().toISOString().split("T")[0] });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });
  };

  const handleStatusChange = (status: 'single' | 'family') => {
    dispatch({ type: 'SET_STATUS', status });
  };

  return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Church Member">
      {/* ✅ Direct action — no useFormState */}
      <form action={createMember} className="space-y-6 p-5">
        {/* Name Fields */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-medium text-text-primary flex items-center gap-2 mb-3">
            <User className="w-4 h-4" />
            Full Name
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="firstName" value={state.firstName} onChange={handleChange} required
              className="px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="First Name *" />
            <input name="middleName" value={state.middleName} onChange={handleChange}
              className="px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Middle Name" />
            <input name="lastName" value={state.lastName} onChange={handleChange} required
              className="px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Last Name *" />
          </div>
        </div>

        {/* Contact & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input name="phone" value={state.phone} onChange={handleChange}
              className="w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="(123) 456-7890" />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input name="joinDate" type="date" value={state.joinDate} onChange={handleChange} required
              className="w-full pl-10 px-4 py-2.5 border border-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Status */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-medium text-text-primary mb-3">Membership Type</h3>
          <div className="flex gap-6">
            <button type="button" onClick={() => handleStatusChange("single")}
              className={`flex-1 py-3 rounded-lg border ${state.status === "single" ? "bg-blue-100 border-blue-500 text-blue-700 font-medium" : "bg-white border-gray-200"}`}>
              Single
            </button>
            <button type="button" onClick={() => handleStatusChange("family")}
              className={`flex-1 py-3 rounded-lg border ${state.status === "family" ? "bg-blue-100 border-blue-500 text-blue-700 font-medium" : "bg-white border-gray-200"}`}>
              Family
            </button>
          </div>
        </div>

        {/* Children */}
        {state.status === "family" && (
          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex justify-between mb-3">
              <h3 className="font-medium text-text-primary">Children</h3>
              <button type="button" onClick={() => dispatch({ type: 'ADD_CHILD' })}
                className="text-primary-600 font-medium">+ Add Child</button>
            </div>
            {state.children.map((child, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input name="childFirstName" value={child.firstName}
                  onChange={e => dispatch({ type: 'UPDATE_CHILD', index: i, field: 'firstName', value: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm" required />
                <input name="childLastName" value={child.lastName}
                  onChange={e => dispatch({ type: 'UPDATE_CHILD', index: i, field: 'lastName', value: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded text-sm" required />
                <button type="button" onClick={() => dispatch({ type: 'REMOVE_CHILD', index: i })}
                  className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}

        {/* Hidden status field */}
        <input type="hidden" name="status" value={state.status} />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 text-text-secondary">
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors"
          >
            Add Member
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
