// app/dashboard/members/components/MessageAlert.tsx
'use client'

import { AlertCircle, Check } from 'lucide-react'

interface MessageAlertProps {
  type: 'error' | 'success'
  message: string
}

export default function MessageAlert({ type, message }: MessageAlertProps) {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-600',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-600'
  }

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
    success: <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
  }

  return (
    <div className={`mb-6 flex items-center gap-2 p-4 border rounded-xl ${styles[type]}`}>
      {icons[type]}
      <p>{message}</p>
    </div>
  )
}