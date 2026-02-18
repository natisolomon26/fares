// app/dashboard/members/components/LoadingSpinner.tsx
'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
        <p className="mt-4 text-gray-600">Loading members...</p>
      </div>
    </div>
  )
}