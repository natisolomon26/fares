// app/dashboard/leaving/components/SummaryCards.tsx
'use client'

import { FileText, Users, CheckCircle, TrendingUp } from 'lucide-react'

interface SummaryCardsProps {
  summary: {
    totalLeavings: number
    recentLeavings: number
    totalMembers: number
    leavingRate: number
    statuses: {
      active: number
      revoked: number
      archived: number
    }
    reasons: {
      transfer: number
      relocation: number
      personal: number
      other: number
    }
  }
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Certificates',
      value: summary.totalLeavings,
      subtext: `${summary.recentLeavings} in last 30 days`,
      icon: FileText,
      color: 'emerald'
    },
    {
      title: 'Active Members',
      value: summary.totalMembers,
      subtext: `${summary.leavingRate}% leaving rate`,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Certificates',
      value: summary.statuses.active,
      subtext: `${summary.statuses.revoked} revoked, ${summary.statuses.archived} archived`,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Most Common',
      value: summary.reasons.transfer > 0 ? 'Transfer' : 
             summary.reasons.relocation > 0 ? 'Relocation' : 'Other',
      subtext: `${summary.reasons.transfer} transfers, ${summary.reasons.relocation} relocations`,
      icon: TrendingUp,
      color: 'purple'
    }
  ]

  const colorClasses = {
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon
        const colors = colorClasses[card.color as keyof typeof colorClasses]
        
        return (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
              <div className={`p-3 ${colors.bg} rounded-lg`}>
                <Icon className={`w-6 h-6 ${colors.text}`} />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{card.subtext}</p>
          </div>
        )
      })}
    </div>
  )
}