// app/dashboard/leaving/[id]/print/page.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Printer, ArrowLeft, Loader2 } from 'lucide-react'

export default function PrintCertificatePage() {
  const params = useParams()
  const [certificate, setCertificate] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchCertificate()
  }, [])

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/leaving/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ leavingId: params.id })
      })
      const data = await response.json()
      setCertificate(data.certificate)
    } catch (error) {
      console.error('Error fetching certificate:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate of Leaving - ${certificate?.certificateNumber}</title>
              <style>
                body {
                  font-family: 'Times New Roman', serif;
                  margin: 0;
                  padding: 40px;
                  background: white;
                }
                .certificate {
                  max-width: 800px;
                  margin: 0 auto;
                  border: 2px solid #000;
                  padding: 40px;
                  position: relative;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .church-name {
                  font-size: 24px;
                  font-weight: bold;
                  text-transform: uppercase;
                  margin-bottom: 5px;
                }
                .title {
                  font-size: 28px;
                  font-weight: bold;
                  text-align: center;
                  margin: 30px 0;
                  text-transform: uppercase;
                  border-top: 2px solid #000;
                  border-bottom: 2px solid #000;
                  padding: 10px 0;
                }
                .content {
                  font-size: 16px;
                  line-height: 1.8;
                  margin: 30px 0;
                }
                .signature {
                  margin-top: 50px;
                  display: flex;
                  justify-content: space-between;
                }
                .signature-line {
                  width: 200px;
                  border-top: 1px solid #000;
                  margin-top: 40px;
                  text-align: center;
                  padding-top: 5px;
                }
                .stamp {
                  position: absolute;
                  bottom: 100px;
                  right: 100px;
                  width: 100px;
                  height: 100px;
                  border: 3px solid #f00;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #f00;
                  font-size: 14px;
                  font-weight: bold;
                  transform: rotate(-15deg);
                  opacity: 0.7;
                }
                @media print {
                  body { margin: 0; padding: 20px; }
                  .no-print { display: none; }
                  .stamp { opacity: 0.3; }
                }
              </style>
            </head>
            <body>
              ${printRef.current?.outerHTML || ''}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
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
    <div className="p-4 lg:p-6">
      {/* Print Controls */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link
          href="/dashboard/leaving"
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700"
        >
          <Printer className="w-5 h-5" />
          Print Certificate
        </button>
      </div>

      {/* Certificate */}
      <div ref={printRef} className="max-w-4xl mx-auto">
        <div className="certificate bg-white border-2 border-gray-800 p-8 md:p-12 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {certificate?.church?.name || 'YOUR CHURCH NAME'}
            </h1>
            <p className="text-gray-600">
              {certificate?.church?.address || 'Church Address'} | {certificate?.church?.phone || 'Phone'}
            </p>
            <p className="text-gray-600">{certificate?.church?.email || 'Email'}</p>
          </div>

          {/* Title */}
          <div className="my-8 text-center">
            <h2 className="text-2xl font-bold border-t-2 border-b-2 border-gray-800 py-3 inline-block px-8">
              CERTIFICATE OF LEAVING
            </h2>
          </div>

          {/* Certificate Number */}
          <p className="text-right text-sm text-gray-600 mb-4">
            No: {certificate?.certificateNumber}
          </p>

          {/* Content */}
          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              This is to certify that <span className="font-bold text-xl">
                {certificate?.member?.fullName}
              </span> has been a faithful member of our church.
            </p>

            {certificate?.member?.children?.length > 0 && (
              <div>
                <p className="font-semibold">Family Members:</p>
                <ul className="list-disc pl-6">
                  {certificate.member.children.map((child: any, index: number) => (
                    <li key={index}>{child.firstName} {child.lastName}</li>
                  ))}
                </ul>
              </div>
            )}

            <p>
              <span className="font-semibold">Reason for Leaving:</span>{' '}
              {certificate?.reason === 'transfer' ? 'Transfer to another church' :
               certificate?.reason === 'relocation' ? 'Relocation/Moving away' :
               certificate?.reason === 'personal' ? 'Personal reasons' : 'Other'}
            </p>

            {certificate?.transferChurch && (
              <p>
                <span className="font-semibold">Transferring to:</span> {certificate.transferChurch}
              </p>
            )}

            {certificate?.notes && (
              <p>
                <span className="font-semibold">Notes:</span> {certificate.notes}
              </p>
            )}

            <p>
              <span className="font-semibold">Leaving Date:</span>{' '}
              {new Date(certificate?.leavingDate).toLocaleDateString()}
            </p>

            <p className="italic mt-4">
              We appreciate their contribution to our church community and wish them God's blessings in their future endeavors.
            </p>
          </div>

          {/* Issue Date */}
          <p className="text-right mt-6">
            <span className="font-semibold">Issued on:</span>{' '}
            {new Date(certificate?.issueDate).toLocaleDateString()}
          </p>

          {/* Signatures */}
          <div className="mt-12 flex justify-between">
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 pt-2"></div>
              <p className="font-semibold mt-1">Pastor's Signature</p>
            </div>
            <div className="text-center">
              <div className="border-t border-gray-400 w-48 pt-2"></div>
              <p className="font-semibold mt-1">Church Seal</p>
            </div>
          </div>

          {/* Official Stamp */}
          <div className="absolute bottom-12 right-12 opacity-30 transform -rotate-12">
            <div className="w-24 h-24 border-4 border-red-500 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold text-center text-xs">
                OFFICIAL<br/>SEAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}