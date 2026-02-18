// app/dashboard/leaving/components/ViewCertificateModal.tsx
'use client'

import { X, Printer, Edit, Calendar, User, FileText } from 'lucide-react'
import Link from 'next/link'
import { LeavingCertificate } from '../../leaving/types/index'

interface ViewCertificateModalProps {
  certificate: LeavingCertificate | null
  onClose: () => void
  onPrint: () => void
}

export default function ViewCertificateModal({ certificate, onClose, onPrint }: ViewCertificateModalProps) {
  if (!certificate) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Certificate Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                {certificate.certificateNumber}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Status Badge */}
          <div className="mb-6">
            <span className={`px-4 py-2 text-sm font-medium rounded-full ${
              certificate.status === 'active' 
                ? 'bg-green-100 text-green-700'
                : certificate.status === 'revoked'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}>
              {certificate.status.toUpperCase()}
            </span>
          </div>

          {/* Certificate Content */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
            {/* Church Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{certificate.churchId?.name || 'Your Church'}</h3>
              <p className="text-gray-600">{certificate.churchId?.address || 'Church Address'}</p>
              <p className="text-gray-600">{certificate.churchId?.phone || 'Phone'} | {certificate.churchId?.email || 'Email'}</p>
            </div>

            {/* Title */}
            <div className="text-center my-6">
              <h4 className="text-xl font-bold border-t-2 border-b-2 border-gray-300 py-2 inline-block px-8">
                CERTIFICATE OF LEAVING
              </h4>
            </div>

            {/* Member Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Member</p>
                  <p className="font-medium">
                    {certificate.memberId?.firstName} {certificate.memberId?.middleName} {certificate.memberId?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{certificate.memberId?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Leaving Date</p>
                  <p>{new Date(certificate.leavingDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="capitalize">{certificate.reason}</p>
                  {certificate.transferChurch && (
                    <p className="text-sm">to {certificate.transferChurch}</p>
                  )}
                </div>
              </div>

              {certificate.notes && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">Notes:</p>
                  <p className="text-gray-800">{certificate.notes}</p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">Issued on:</p>
                <p>{new Date(certificate.issueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={`/dashboard/leaving/${certificate._id}/edit`}
              className="flex-1 py-3 border border-emerald-600 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={onPrint}
              className="flex-1 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}