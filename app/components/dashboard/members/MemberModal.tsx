// src/components/dashboard/members/MemberModal.tsx
'use client';

import { useEffect, useReducer } from 'react';
import { createMember } from '@/actions/member';
import Modal from '../ui/Modal';
import { UserPlus } from 'lucide-react';

type State = {
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  joinDate: string;
  status: 'single' | 'family';
  children: { firstName: string; lastName: string }[];
};

type Action =
  | { type: 'SET_FIELD'; field: string; value: string }
  | { type: 'SET_STATUS'; status: 'single' | 'family' }
  | { type: 'ADD_CHILD' }
  | { type: 'REMOVE_CHILD'; index: number }
  | { type: 'UPDATE_CHILD'; index: number; field: 'firstName' | 'lastName'; value: string };

const initialState: State = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  joinDate: new Date().toISOString().split('T')[0],
  status: 'single',
  children: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_STATUS':
      return { ...state, status: action.status, children: action.status === 'single' ? [] : state.children };
    case 'ADD_CHILD':
      return { ...state, children: [...state.children, { firstName: '', lastName: '' }] };
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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MemberModal({ isOpen, onClose }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'SET_FIELD', field: 'joinDate', value: new Date().toISOString().split('T')[0] });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Church Member">
      <form action={createMember} className="space-y-6 p-5">
        {/* Full Name */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="firstName" value={state.firstName} onChange={handleChange} required placeholder="First Name" className="border p-2 rounded" />
          <input name="middleName" value={state.middleName} onChange={handleChange} placeholder="Middle Name" className="border p-2 rounded" />
          <input name="lastName" value={state.lastName} onChange={handleChange} required placeholder="Last Name" className="border p-2 rounded" />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="phone" value={state.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />
          <input name="joinDate" type="date" value={state.joinDate} onChange={handleChange} className="border p-2 rounded" />
        </div>

        {/* Status */}
        <div className="flex gap-4">
          <button type="button" onClick={() => dispatch({ type: 'SET_STATUS', status: 'single' })} className={`flex-1 border p-2 rounded ${state.status === 'single' ? 'bg-blue-100' : ''}`}>Single</button>
          <button type="button" onClick={() => dispatch({ type: 'SET_STATUS', status: 'family' })} className={`flex-1 border p-2 rounded ${state.status === 'family' ? 'bg-blue-100' : ''}`}>Family</button>
        </div>

        {/* Children */}
        {state.status === 'family' && (
          <div className="space-y-2">
            <button type="button" onClick={() => dispatch({ type: 'ADD_CHILD' })} className="text-blue-600 text-sm font-medium">
              + Add Child
            </button>
            {state.children.map((child, i) => (
              <div key={i} className="flex gap-2">
                <input name="childFirstName" value={child.firstName} onChange={e => dispatch({ type: 'UPDATE_CHILD', index: i, field: 'firstName', value: e.target.value })} placeholder="Child First Name" className="border p-2 rounded flex-1" />
                <input name="childLastName" value={child.lastName} onChange={e => dispatch({ type: 'UPDATE_CHILD', index: i, field: 'lastName', value: e.target.value })} placeholder="Child Last Name" className="border p-2 rounded flex-1" />
                <button type="button" onClick={() => dispatch({ type: 'REMOVE_CHILD', index: i })} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
          </div>
        )}

        <input type="hidden" name="status" value={state.status} />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2">
            Add Member
            <UserPlus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
