// app/dashboard/leaving/components/CertificatesTable.tsx
'use client'

import Link from 'next/link'
import { Eye, Edit, Printer, Trash2 } from 'lucide-react'
import { LeavingCertificate } from '../../leaving/types/index'

interface CertificatesTableProps {
  certificates: LeavingCertificate[]
  onView: (certificate: LeavingCertificate) => void
  onDelete: (id: string) => void
  onPrint: (id: string) => void
}

export default function CertificatesTable({ 
  certificates, 
  onView, 
  onDelete, 
  onPrint 
}: CertificatesTableProps) {
  
  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-700',
      revoked: 'bg-red-100 text-red-700',
      archived: 'bg-gray-100 text-gray-700'
    }
    return styles[status as keyof typeof styles] || styles.archived
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500">No certificates found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Certificate #
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Member
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Reason
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Leaving Date
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <span className="font-mono text-sm font-medium text-gray-800">
                    {cert.certificateNumber}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-800">
                      {cert.memberId.firstName} {cert.memberId.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{cert.memberId.phone}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="text-gray-800 capitalize">{cert.reason}</p>
                    {cert.transferChurch && (
                      <p className="text-sm text-gray-600">to {cert.transferChurch}</p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  {new Date(cert.leavingDate).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(cert.status)}`}>
                    {cert.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(cert)}
                      className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Link
                      href={`/dashboard/leaving/${cert._id}/edit`}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onPrint(cert._id)}
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(cert._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
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
    </div>
  )
}