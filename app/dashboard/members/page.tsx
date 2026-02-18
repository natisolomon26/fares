// app/dashboard/members/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, Search, Filter, UserPlus, Edit, Trash2, 
  Eye, Phone, Mail, Calendar, User, ChevronLeft, 
  ChevronRight, Loader2, Plus, X, Check, AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface Member {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  isFamily: boolean
  children: Array<{
    _id: string
    firstName: string
    middleName?: string
    lastName: string
  }>
  createdAt: string
  updatedAt: string
}

interface NewMemberForm {
  firstName: string
  middleName: string
  lastName: string
  phone: string
  isFamily: boolean
  children: Array<{
    firstName: string
    middleName: string
    lastName: string
  }>
}

export default function MembersPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [viewingMember, setViewingMember] = useState<Member | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const [newMember, setNewMember] = useState<NewMemberForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    phone: '',
    isFamily: false,
    children: []
  })

  const [newChild, setNewChild] = useState({
    firstName: '',
    middleName: '',
    lastName: ''
  })

  // Fetch members on mount
  useEffect(() => {
    if (!authLoading && user) {
      fetchMembers()
    }
  }, [authLoading, user])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('')
        setSuccess('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, success])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/members', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch members')
      }

      const data = await response.json()
      setMembers(data.members || [])
    } catch (err) {
      setError('Failed to load members. Please try again.')
      console.error('Error fetching members:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate
    if (!newMember.firstName || !newMember.lastName || !newMember.phone) {
      setError('First name, last name, and phone are required')
      return
    }

    // Format children
    const formattedChildren = newMember.isFamily 
      ? newMember.children.map(child => ({
          firstName: child.firstName,
          middleName: child.middleName,
          lastName: child.lastName || newMember.lastName
        }))
      : []

    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: newMember.firstName,
          middleName: newMember.middleName,
          lastName: newMember.lastName,
          phone: newMember.phone,
          isFamily: newMember.isFamily,
          children: formattedChildren
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Member added successfully!')
        setShowAddForm(false)
        setNewMember({
          firstName: '',
          middleName: '',
          lastName: '',
          phone: '',
          isFamily: false,
          children: []
        })
        fetchMembers()
      } else {
        setError(data.message || 'Failed to add member')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error adding member:', err)
    }
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMember) return

    setError('')
    
    try {
      const response = await fetch(`/api/members/${editingMember._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName: editingMember.firstName,
          middleName: editingMember.middleName || '',
          lastName: editingMember.lastName,
          phone: editingMember.phone,
          isFamily: editingMember.isFamily,
          children: editingMember.children
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Member updated successfully!')
        setEditingMember(null)
        fetchMembers()
      } else {
        setError(data.message || 'Failed to update member')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error updating member:', err)
    }
  }

  const handleDeleteMember = async (id: string) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Member deleted successfully!')
        setDeleteConfirm(null)
        fetchMembers()
      } else {
        setError(data.message || 'Failed to delete member')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Error deleting member:', err)
    }
  }

  const addChild = () => {
    if (!newChild.firstName || !newChild.lastName) {
      setError('Child first and last name are required')
      return
    }

    if (editingMember) {
      setEditingMember({
        ...editingMember,
        children: [...editingMember.children, {
          _id: Date.now().toString(),
          firstName: newChild.firstName,
          middleName: newChild.middleName,
          lastName: newChild.lastName || editingMember.lastName
        }]
      })
    } else {
      setNewMember({
        ...newMember,
        children: [...newMember.children, {
          firstName: newChild.firstName,
          middleName: newChild.middleName,
          lastName: newChild.lastName || newMember.lastName
        }]
      })
    }

    setNewChild({ firstName: '', middleName: '', lastName: '' })
  }

  const removeChild = (index: number) => {
    if (editingMember) {
      const updatedChildren = [...editingMember.children]
      updatedChildren.splice(index, 1)
      setEditingMember({
        ...editingMember,
        children: updatedChildren
      })
    } else {
      const updatedChildren = [...newMember.children]
      updatedChildren.splice(index, 1)
      setNewMember({
        ...newMember,
        children: updatedChildren
      })
    }
  }

  // Filter members based on search
  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase()
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.phone.includes(searchLower) ||
      (member.middleName && member.middleName.toLowerCase().includes(searchLower))
    )
  })

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + itemsPerPage)

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Members Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your church members and their families
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition-all"
          >
            <UserPlus className="w-5 h-5" />
            Add New Member
          </button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-800">{members.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Families</p>
                <p className="text-xl font-bold text-emerald-600">
                  {members.filter(m => m.isFamily).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-emerald-600">{success}</p>
        </div>
      )}

      {/* Add/Edit Member Form Modal */}
      {(showAddForm || editingMember) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingMember ? 'Edit Member' : 'Add New Member'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingMember(null)
                    setNewMember({
                      firstName: '',
                      middleName: '',
                      lastName: '',
                      phone: '',
                      isFamily: false,
                      children: []
                    })
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={editingMember ? handleUpdateMember : handleAddMember}>
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={editingMember ? editingMember.firstName : newMember.firstName}
                        onChange={(e) => editingMember 
                          ? setEditingMember({...editingMember, firstName: e.target.value})
                          : setNewMember({...newMember, firstName: e.target.value})
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={editingMember ? editingMember.middleName || '' : newMember.middleName}
                        onChange={(e) => editingMember 
                          ? setEditingMember({...editingMember, middleName: e.target.value})
                          : setNewMember({...newMember, middleName: e.target.value})
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={editingMember ? editingMember.lastName : newMember.lastName}
                        onChange={(e) => editingMember 
                          ? setEditingMember({...editingMember, lastName: e.target.value})
                          : setNewMember({...newMember, lastName: e.target.value})
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={editingMember ? editingMember.phone : newMember.phone}
                        onChange={(e) => editingMember 
                          ? setEditingMember({...editingMember, phone: e.target.value})
                          : setNewMember({...newMember, phone: e.target.value})
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Family Option */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isFamily"
                      checked={editingMember ? editingMember.isFamily : newMember.isFamily}
                      onChange={(e) => editingMember 
                        ? setEditingMember({...editingMember, isFamily: e.target.checked})
                        : setNewMember({...newMember, isFamily: e.target.checked})
                      }
                      className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="isFamily" className="text-gray-700 font-medium">
                      This is a family
                    </label>
                  </div>

                  {/* Children Section */}
                  {(editingMember?.isFamily || newMember.isFamily) && (
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
                        />
                        <input
                          type="text"
                          placeholder="Middle Name"
                          value={newChild.middleName}
                          onChange={(e) => setNewChild({...newChild, middleName: e.target.value})}
                          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Last Name"
                            value={newChild.lastName}
                            onChange={(e) => setNewChild({...newChild, lastName: e.target.value})}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={addChild}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Children List */}
                      <div className="space-y-2">
                        {(editingMember?.children || newMember.children).map((child, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-800">
                                {child.firstName} {child.middleName} {child.lastName}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all"
                    >
                      {editingMember ? 'Update Member' : 'Add Member'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false)
                        setEditingMember(null)
                        setNewMember({
                          firstName: '',
                          middleName: '',
                          lastName: '',
                          phone: '',
                          isFamily: false,
                          children: []
                        })
                      }}
                      className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Member Modal */}
      {viewingMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Member Details</h2>
                <button
                  onClick={() => setViewingMember(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Member Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {viewingMember.firstName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {viewingMember.firstName} {viewingMember.middleName} {viewingMember.lastName}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{viewingMember.phone}</span>
                      </div>
                      {viewingMember.isFamily && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Family
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-800">
                      {new Date(viewingMember.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium text-gray-800">
                      {new Date(viewingMember.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Children Section */}
                {viewingMember.isFamily && viewingMember.children.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Children</h4>
                    <div className="space-y-2">
                      {viewingMember.children.map((child, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-emerald-600" />
                          <span className="text-gray-700">
                            {child.firstName} {child.middleName} {child.lastName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setViewingMember(null)
                      setEditingMember(viewingMember)
                    }}
                    className="flex-1 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    Edit Member
                  </button>
                  <button
                    onClick={() => setViewingMember(null)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Member</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this member? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDeleteMember(deleteConfirm)}
                  className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {paginatedMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No members found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? 'Try a different search term' : 'Get started by adding your first member'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all"
            >
              <UserPlus className="w-5 h-5 inline-block mr-2" />
              Add First Member
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Type</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member) => (
                    <tr key={member._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {member.firstName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {member.firstName} {member.lastName}
                            </p>
                            {member.middleName && (
                              <p className="text-sm text-gray-600">{member.middleName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4" />
                          {member.phone}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {member.isFamily ? (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                            Family ({member.children.length} children)
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            Individual
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewingMember(member)}
                            className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingMember(member)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(member._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of {filteredMembers.length} members
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-emerald-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}