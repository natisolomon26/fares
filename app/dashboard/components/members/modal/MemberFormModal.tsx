// app/dashboard/members/components/MemberFormModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Trash2, User } from 'lucide-react'
import { Member, NewMemberForm } from '../../types/index'

interface MemberFormModalProps {
  isOpen: boolean
  onClose: () => void
  member: Member | null
  onSuccess: () => void
  onError: (error: string) => void
}

interface ChildForm {
  firstName: string
  middleName: string
  lastName: string
}

export default function MemberFormModal({ 
  isOpen, 
  onClose, 
  member, 
  onSuccess, 
  onError 
}: MemberFormModalProps) {
  const [formData, setFormData] = useState<NewMemberForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    isFamily: false,
    children: []
  })

  const [newChild, setNewChild] = useState<ChildForm>({
    firstName: '',
    middleName: '',
    lastName: ''
  })

  const [submitting, setSubmitting] = useState(false)

  // Reset form when modal opens/closes or member changes
  useEffect(() => {
    if (member) {
      setFormData({
        firstName: member.firstName,
        middleName: member.middleName || '',
        lastName: member.lastName,
        phone: member.phone,
        isFamily: member.isFamily,
        children: member.children.map(c => ({
          firstName: c.firstName,
          middleName: c.middleName || '',
          lastName: c.lastName
        }))
      })
    } else {
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        phone: '',
        isFamily: false,
        children: []
      })
    }
    setNewChild({ firstName: '', middleName: '', lastName: '' })
  }, [member, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      onError('First name, last name, and phone are required')
      setSubmitting(false)
      return
    }

    // Format children
    const formattedChildren = formData.isFamily 
      ? formData.children.map(child => ({
          firstName: child.firstName,
          middleName: child.middleName,
          lastName: child.lastName || formData.lastName
        }))
      : []

    try {
      const url = member 
        ? `/api/members/${member._id}`
        : '/api/members'
      
      const method = member ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          phone: formData.phone,
          isFamily: formData.isFamily,
          children: formattedChildren
        })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        onError(data.message || `Failed to ${member ? 'update' : 'add'} member`)
      }
    } catch (err) {
      onError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const addChild = () => {
    if (!newChild.firstName || !newChild.lastName) {
      onError('Child first and last name are required')
      return
    }

    setFormData({
      ...formData,
      children: [...formData.children, {
        firstName: newChild.firstName,
        middleName: newChild.middleName,
        lastName: newChild.lastName || formData.lastName
      }]
    })

    setNewChild({ firstName: '', middleName: '', lastName: '' })
  }

  const removeChild = (index: number) => {
    const updatedChildren = [...formData.children]
    updatedChildren.splice(index, 1)
    setFormData({
      ...formData,
      children: updatedChildren
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {member ? 'Edit Member' : 'Add New Member'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.middleName}
                    onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              {/* Family Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFamily"
                  checked={formData.isFamily}
                  onChange={(e) => setFormData({...formData, isFamily: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  disabled={submitting}
                />
                <label htmlFor="isFamily" className="text-gray-700 font-medium">
                  This is a family
                </label>
              </div>

              {/* Children Section */}
              {formData.isFamily && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Children</h3>
                  
                  {/* Add Child Form */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={newChild.firstName}
                      onChange={(e) => setNewChild({...newChild, firstName: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                      disabled={submitting}
                    />
                    <input
                      type="text"
                      placeholder="Middle Name"
                      value={newChild.middleName}
                      onChange={(e) => setNewChild({...newChild, middleName: e.target.value})}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                      disabled={submitting}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={newChild.lastName}
                        onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        disabled={submitting}
                      />
                      <button
                        type="button"
                        onClick={addChild}
                        disabled={submitting}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Children List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {formData.children.map((child, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-800">
                            {child.firstName} {child.middleName} {child.lastName}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          disabled={submitting}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {formData.children.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No children added yet
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}