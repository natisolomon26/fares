// app/dashboard/leaving/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

// Types
import { LeavingCertificate, Summary } from './types'

// Components
import LoadingSpinner from '@/app/dashboard/components/leaving/LoadingSpinner'
import SummaryCards from '@/app/dashboard/components/leaving/SummaryCards'
import SearchFilter from '@/app/dashboard/components/leaving/SearchFilter'
import CertificatesTable from '@/app/dashboard/components/leaving/CertificatesTable'
import Pagination from '@/app/dashboard/components/leaving/Pagination'
import EmptyState from '@/app/dashboard/components/leaving/EmptyState'
import DeleteConfirmationModal from '@/app/dashboard/components/leaving/DeleteConfirmationModal'
import NewCertificateModal from '@/app/dashboard/components/leaving/NewCertificateModal'
import ViewCertificateModal from '@/app/dashboard/components/leaving/ViewCertificateModal'

export default function LeavingPage() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<LeavingCertificate[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  // Modal states
  const [showNewModal, setShowNewModal] = useState(false)
  const [viewingCertificate, setViewingCertificate] = useState<LeavingCertificate | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch certificates
      const certRes = await fetch('/api/leaving', {
        credentials: 'include'
      })
      const certData = await certRes.json()
      setCertificates(certData.leavings || [])

      // Fetch summary
      const summaryRes = await fetch('/api/leaving/summary', {
        credentials: 'include'
      })
      const summaryData = await summaryRes.json()
      setSummary(summaryData.summary)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setDeleting(true)
      const response = await fetch(`/api/leaving/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setCertificates(certificates.filter(c => c._id !== id))
        setShowDeleteModal(null)
        fetchData()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handlePrint = (id: string) => {
    router.push(`/dashboard/leaving/${id}/print`)
  }

  // Filter certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.memberId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.memberId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.memberId.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCertificates = filteredCertificates.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Leaving Certificates</h1>
          <p className="text-gray-600 mt-1">
            Manage member leaving certificates and transfers
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg shadow-emerald-900/30"
        >
          <Plus className="w-5 h-5" />
          New Certificate
        </button>
      </div>

      {/* Summary Cards */}
      {summary && <SummaryCards summary={summary} />}

      {/* Search and Filter */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Certificates Table or Empty State */}
      {paginatedCertificates.length === 0 ? (
        <EmptyState 
          searchTerm={searchTerm} 
          onNewClick={() => setShowNewModal(true)} 
        />
      ) : (
        <>
          <CertificatesTable
            certificates={paginatedCertificates}
            onView={setViewingCertificate}
            onDelete={setShowDeleteModal}
            onPrint={handlePrint}
          />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            startIndex={startIndex}
            endIndex={Math.min(startIndex + itemsPerPage, filteredCertificates.length)}
            totalItems={filteredCertificates.length}
          />
        </>
      )}

      {/* Modals */}
      <NewCertificateModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSuccess={() => {
          fetchData()
          setShowNewModal(false)
        }}
      />

      <ViewCertificateModal
        certificate={viewingCertificate}
        onClose={() => setViewingCertificate(null)}
        onPrint={() => {
          if (viewingCertificate) {
            handlePrint(viewingCertificate._id)
            setViewingCertificate(null)
          }
        }}
      />

      <DeleteConfirmationModal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => handleDelete(showDeleteModal!)}
        deleting={deleting}
      />
    </div>
  )
}