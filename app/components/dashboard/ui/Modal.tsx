// src/components/dashboard/ui/Modal.tsx
"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-text-secondary"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}