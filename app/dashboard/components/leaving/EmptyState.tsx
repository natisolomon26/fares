// app/dashboard/leaving/components/EmptyState.tsx
'use client'

import { FileText, Plus } from 'lucide-react'

interface EmptyStateProps {
  searchTerm: string
  onNewClick: () => void
}

export default function EmptyState({ searchTerm, onNewClick }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-600 mb-2">No certificates found</h3>
      <p className="text-gray-500 mb-6">
        {searchTerm ? 'Try a different search term' : 'Create your first leaving certificate'}
      </p>
      {!searchTerm && (
        <button
          onClick={onNewClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Create Certificate
        </button>
      )}
    </div>
  )
}