'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Download, 
  Calendar, 
  Users, 
  Heart, 
  Baby, 
  TrendingUp,
  PieChart,
  BarChart3,
  DownloadCloud,
  Printer
} from 'lucide-react'

interface Member {
  _id: string
  firstName: string
  middleName?: string
  lastName: string
  phone: string
  isFamily: boolean
  children: Array<{
    firstName: string
    middleName?: string
    lastName: string
  }>
  createdAt: string
}

interface ReportStats {
  totalMembers: number
  totalChildren: number
  totalIndividuals: number
  familyCount: number
  singleCount: number
  familiesWithChildren: number
  familiesWithoutChildren: number
  averageChildrenPerFamily: number
  maxChildrenInFamily: number
  totalChildrenCount: number
  summary: string
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('all')
  const [stats, setStats] = useState<ReportStats>({
    totalMembers: 0,
    totalChildren: 0,
    totalIndividuals: 0,
    familyCount: 0,
    singleCount: 0,
    familiesWithChildren: 0,
    familiesWithoutChildren: 0,
    averageChildrenPerFamily: 0,
    maxChildrenInFamily: 0,
    totalChildrenCount: 0,
    summary: ''
  })

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/members', {
        credentials: 'include'
      })
      const data = await response.json()
      setMembers(data.members || [])
      calculateStats(data.members || [])
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (membersData: Member[]) => {
    const totalMembers = membersData.length
    const totalChildren = membersData.reduce((acc, member) => 
      acc + (member.children?.length || 0), 0)
    const totalIndividuals = totalMembers + totalChildren
    
    const familyCount = membersData.filter(m => m.isFamily).length
    const singleCount = membersData.filter(m => !m.isFamily).length
    
    const familiesWithChildren = membersData.filter(m => m.isFamily && m.children?.length > 0).length
    const familiesWithoutChildren = familyCount - familiesWithChildren
    
    const averageChildrenPerFamily = familiesWithChildren > 0 
      ? Number((totalChildren / familiesWithChildren).toFixed(1))
      : 0
      
    const maxChildrenInFamily = membersData.reduce((max, member) => 
      Math.max(max, member.children?.length || 0), 0)

    const summary = `${totalMembers} member${totalMembers !== 1 ? 's' : ''} (${familyCount} family/${singleCount} single) with ${totalChildren} child${totalChildren !== 1 ? 'ren' : ''}`

    setStats({
      totalMembers,
      totalChildren,
      totalIndividuals,
      familyCount,
      singleCount,
      familiesWithChildren,
      familiesWithoutChildren,
      averageChildrenPerFamily,
      maxChildrenInFamily,
      totalChildrenCount: totalChildren,
      summary
    })
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['First Name', 'Middle Name', 'Last Name', 'Phone', 'Type', 'Children Count', 'Registered Date']
    const rows = members.map(m => [
      m.firstName,
      m.middleName || '',
      m.lastName,
      m.phone,
      m.isFamily ? 'Family' : 'Individual',
      m.children?.length.toString() || '0',
      new Date(m.createdAt).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `members-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Reports</h1>
          <p className="text-gray-600 mt-1">
            View and analyze your church membership data
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
          >
            <DownloadCloud className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-lg font-semibold">Membership Summary</h2>
        </div>
        <p className="text-xl font-medium">{stats.summary}</p>
        <p className="text-sm opacity-90 mt-2">
          As of {new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Members */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalMembers}</p>
          <p className="text-sm text-gray-600 mt-1">Church Members</p>
        </div>

        {/* Total Children */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Baby className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Children</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.totalChildren}</p>
          <p className="text-sm text-gray-600 mt-1">From {stats.familiesWithChildren} families</p>
        </div>

        {/* Families */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-rose-100 rounded-lg">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <span className="text-sm text-gray-500">Families</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.familyCount}</p>
          <p className="text-sm text-gray-600 mt-1">
            {stats.familiesWithChildren} with children, {stats.familiesWithoutChildren} without
          </p>
        </div>

        {/* Singles */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Singles</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.singleCount}</p>
          <p className="text-sm text-gray-600 mt-1">Individual members</p>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Family Statistics */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Family Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Total Families</span>
              <span className="font-semibold text-gray-800">{stats.familyCount}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Families with Children</span>
              <span className="font-semibold text-gray-800">{stats.familiesWithChildren}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Families without Children</span>
              <span className="font-semibold text-gray-800">{stats.familiesWithoutChildren}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-gray-600">Average Children per Family</span>
              <span className="font-semibold text-gray-800">{stats.averageChildrenPerFamily}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Largest Family Size</span>
              <span className="font-semibold text-gray-800">{stats.maxChildrenInFamily} children</span>
            </div>
          </div>
        </div>

        {/* Registration Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-500" />
            Registration Timeline
          </h3>
          <div className="space-y-4">
            {members.length > 0 ? (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Earliest Registration</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(Math.min(...members.map(m => new Date(m.createdAt).getTime()))).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-600">Latest Registration</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(Math.max(...members.map(m => new Date(m.createdAt).getTime()))).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Registration Period</span>
                  <span className="font-semibold text-gray-800">
                    {Math.ceil((new Date().getTime() - Math.min(...members.map(m => new Date(m.createdAt).getTime()))) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No registration data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Recent Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Phone</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Children</th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Registered</th>
              </tr>
            </thead>
            <tbody>
              {members.slice(0, 5).map((member) => (
                <tr key={member._id} className="border-t border-gray-100">
                  <td className="py-3 px-6">
                    <span className="font-medium text-gray-800">
                      {member.firstName} {member.lastName}
                    </span>
                    {member.middleName && (
                      <span className="text-sm text-gray-500 ml-1">({member.middleName})</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{member.phone}</td>
                  <td className="py-3 px-6">
                    {member.isFamily ? (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                        Family
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        Individual
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-gray-600">{member.children?.length || 0}</td>
                  <td className="py-3 px-6 text-gray-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Note */}
      <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
        <Download className="w-4 h-4" />
        <p>Export data as CSV for further analysis in spreadsheet software</p>
      </div>
    </div>
  )
}