// app/dashboard/members/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { Member, NewMemberForm } from '@/app/dashboard/components/types/index'

// Components
import LoadingSpinner from '@/app/dashboard/components/LoadingSpinner'
import MembersHeader from '@/app/dashboard/components/members/MembersHeader'
import SearchBar from '@/app/dashboard/components/members/SearchBar'
import MembersStats from '@/app/dashboard/components/members/MembersStats'
import MessageAlert from '@/app/dashboard/components/members/MessageAlert'
import MembersTable from '@/app/dashboard/components/members/MembersTable'
import Pagination from '@/app/dashboard/components/members/Pagination'
import MemberFormModal from '@/app/dashboard/components/members/modal/MemberFormModal'
import MemberViewModal from '@/app/dashboard/components/members/modal/MemberViewModal'
import DeleteConfirmModal from '@/app/dashboard/components/members/modal/DeleteConfirmModal'

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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Member deleted successfully!')
        fetchMembers()
      } else {
        setError(data.message || 'Failed to delete member')
      }
    } catch (err) {
      setError('Network error. Please try again.')
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

  // Calculate comprehensive stats
  const totalMembers = members.length
  const totalChildren = members.reduce((acc, member) => 
    acc + (member.children?.length || 0), 0)
  const totalIndividuals = totalMembers + totalChildren
  
  const familyCount = members.filter(m => m.isFamily).length
  const singleCount = members.filter(m => !m.isFamily).length
  
  const familiesWithChildren = members.filter(m => m.isFamily && m.children?.length > 0).length
  const familiesWithoutChildren = familyCount - familiesWithChildren
  
  const averageChildrenPerFamily = familiesWithChildren > 0 
    ? Number((totalChildren / familiesWithChildren).toFixed(1))
    : 0
    
  const maxChildrenInFamily = members.reduce((max, member) => 
    Math.max(max, member.children?.length || 0), 0)

  const summary = `${totalMembers} member${totalMembers !== 1 ? 's' : ''} (${familyCount} family/${singleCount} single) with ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}`

  if (authLoading || loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-4 lg:p-6">
      <MembersHeader 
        onAddClick={() => setShowAddForm(true)} 
        totalMembers={members.length}
      />

      {/* Stats Section - Now with all stats */}
      <MembersStats 
        totalMembers={totalMembers}
        totalChildren={totalChildren}
        totalIndividuals={totalIndividuals}
        familyCount={familyCount}
        singleCount={singleCount}
        familiesWithChildren={familiesWithChildren}
        familiesWithoutChildren={familiesWithoutChildren}
        averageChildrenPerFamily={averageChildrenPerFamily}
        maxChildrenInFamily={maxChildrenInFamily}
        summary={summary}
      />

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar 
          value={searchTerm} 
          onChange={setSearchTerm}
          placeholder="Search members by name or phone..."
        />
      </div>

      {/* Messages */}
      {error && <MessageAlert type="error" message={error} />}
      {success && <MessageAlert type="success" message={success} />}

      {/* Modals */}
      <MemberFormModal
        isOpen={showAddForm || !!editingMember}
        onClose={() => {
          setShowAddForm(false)
          setEditingMember(null)
        }}
        member={editingMember}
        onSuccess={() => {
          setSuccess(editingMember ? 'Member updated successfully!' : 'Member added successfully!')
          fetchMembers()
        }}
        onError={setError}
      />

      <MemberViewModal
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onEdit={(member) => {
          setViewingMember(null)
          setEditingMember(member)
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm!)}
        title="Delete Member"
        message="Are you sure you want to delete this member? This action cannot be undone."
      />

      {/* Members Table */}
      <MembersTable
        members={paginatedMembers}
        onView={setViewingMember}
        onEdit={setEditingMember}
        onDelete={setDeleteConfirm}
      />

      {/* Empty State */}
      {filteredMembers.length === 0 && !loading && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-400">👥</span>
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm ? 'No members found' : 'No members yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? 'Try a different search term' 
              : 'Get started by adding your first member'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all"
            >
              Add First Member
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={Math.min(startIndex + itemsPerPage, filteredMembers.length)}
          totalItems={filteredMembers.length}
        />
      )}
    </div>
  )
}