// app/dashboard/leaving/[id]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

export default function EditCertificatePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [certificate, setCertificate] = useState<any>(null)
  const [formData, setFormData] = useState({
    reason: '',
    transferChurch: '',
    leavingDate: '',
    notes: '',
    status: ''
  })

  useEffect(() => {
    fetchCertificate()
  }, [])

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/leaving/${params.id}`, {
        credentials: 'include'
      })
      const data = await response.json()
      setCertificate(data.leaving)
      setFormData({
        reason: data.leaving.reason,
        transferChurch: data.leaving.transferChurch || '',
        leavingDate: data.leaving.leavingDate.split('T')[0],
        notes: data.leaving.notes || '',
        status: data.leaving.status
      })
    } catch (error) {
      console.error('Error fetching certificate:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const response = await fetch(`/api/leaving/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/dashboard/leaving')
        router.refresh()
      }
    } catch (error) {
      console.error('Error updating:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/leaving"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Certificate</h1>
          <p className="text-gray-600">{certificate?.certificateNumber}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        {/* Member Info (Read-only) */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Member</p>
          <p className="font-medium">
            {certificate?.memberId.firstName} {certificate?.memberId.lastName}
          </p>
          <p className="text-sm text-gray-600">{certificate?.memberId.phone}</p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option value="active">Active</option>
            <option value="revoked">Revoked</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason
          </label>
          <select
            value={formData.reason}
            onChange={(e) => setFormData({...formData, reason: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
          >
            <option value="transfer">Transfer</option>
            <option value="relocation">Relocation</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Transfer Church */}
        {formData.reason === 'transfer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transferring Church
            </label>
            <input
              type="text"
              value={formData.transferChurch}
              onChange={(e) => setFormData({...formData, transferChurch: e.target.value})}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Leaving Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Leaving Date
          </label>
          <input
            type="date"
            value={formData.leavingDate}
            onChange={(e) => setFormData({...formData, leavingDate: e.target.value})}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Link
            href="/dashboard/leaving"
            className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}