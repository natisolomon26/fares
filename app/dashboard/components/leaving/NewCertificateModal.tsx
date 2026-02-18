// app/dashboard/leaving/components/NewCertificateModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Search, Loader2, AlertCircle } from 'lucide-react'

interface Member {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  isFamily?: boolean
  children?: any[]
}

interface NewCertificateModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function NewCertificateModal({ isOpen, onClose, onSuccess }: NewCertificateModalProps) {
  const [step, setStep] = useState(1)
  const [allMembers, setAllMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    reason: 'transfer',
    transferChurch: '',
    leavingDate: new Date().toISOString().split('T')[0],
    notes: ''
  })

  // Fetch all members when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAllMembers()
    }
  }, [isOpen])

  // Filter members based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers([])
      return
    }

    const searchLower = searchTerm.toLowerCase()
    const filtered = allMembers.filter(member => 
      member.firstName.toLowerCase().includes(searchLower) ||
      (member.middleName && member.middleName.toLowerCase().includes(searchLower)) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.phone.includes(searchTerm)
    )
    setFilteredMembers(filtered)
  }, [searchTerm, allMembers])

  const fetchAllMembers = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/members', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch members')
      }
      
      setAllMembers(data.members || [])
      
    } catch (error) {
      console.error('Error fetching members:', error)
      setError('Failed to load members')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedMember) return

    if (formData.reason === 'transfer' && !formData.transferChurch.trim()) {
      setError('Transfer church name is required')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      
      const response = await fetch('/api/leaving', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          memberId: selectedMember._id,
          reason: formData.reason,
          transferChurch: formData.reason === 'transfer' ? formData.transferChurch : undefined,
          leavingDate: formData.leavingDate,
          notes: formData.notes || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        resetForm()
        onClose()
      } else {
        setError(data.message || 'Failed to create certificate')
      }
    } catch (error) {
      console.error('Error creating certificate:', error)
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedMember(null)
    setSearchTerm('')
    setError('')
    setFilteredMembers([])
    setFormData({
      reason: 'transfer',
      transferChurch: '',
      leavingDate: new Date().toISOString().split('T')[0],
      notes: ''
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {step === 1 ? 'Select Member' : 'Certificate Details'}
            </h2>
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-gray-100 rounded-lg"
              disabled={submitting}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Step 1: Member Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  </div>
                ) : filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <button
                      key={member._id}
                      onClick={() => {
                        setSelectedMember(member)
                        setStep(2)
                        setError('')
                      }}
                      className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            {member.firstName} {member.middleName} {member.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{member.phone}</p>
                        </div>
                        {member.isFamily && (
                          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                            Family ({member.children?.length || 0})
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                ) : searchTerm.length > 0 ? (
                  <p className="text-center py-8 text-gray-500">No members found</p>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    Type to search for members
                  </p>
                )}
              </div>

              {/* Member Count */}
              {!loading && allMembers.length > 0 && (
                <p className="text-xs text-gray-500 text-center">
                  {allMembers.length} total members in church
                </p>
              )}
            </div>
          )}

          {/* Step 2: Certificate Details */}
          {step === 2 && selectedMember && (
            <div className="space-y-4">
              {/* Selected Member Info */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-sm text-emerald-600 mb-1">Selected Member:</p>
                <p className="font-medium text-gray-800">
                  {selectedMember.firstName} {selectedMember.middleName} {selectedMember.lastName}
                </p>
                <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                {selectedMember.isFamily && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Family member with {selectedMember.children?.length || 0} children
                  </p>
                )}
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leaving *
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => {
                    setFormData({...formData, reason: e.target.value})
                    setError('')
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                >
                  <option value="transfer">Transfer to another church</option>
                  <option value="relocation">Relocation/Moving away</option>
                  <option value="personal">Personal reasons</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Transfer Church */}
              {formData.reason === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transferring to Church *
                  </label>
                  <input
                    type="text"
                    value={formData.transferChurch}
                    onChange={(e) => setFormData({...formData, transferChurch: e.target.value})}
                    placeholder="Enter church name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              )}

              {/* Leaving Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leaving Date *
                </label>
                <input
                  type="date"
                  value={formData.leavingDate}
                  onChange={(e) => setFormData({...formData, leavingDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Any additional information..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setStep(1)
                    setError('')
                  }}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || (formData.reason === 'transfer' && !formData.transferChurch.trim())}
                  className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Certificate'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}