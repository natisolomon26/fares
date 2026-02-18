// app/dashboard/components/members/MembersStats.tsx
'use client'

import { Users, Heart, Baby, User, Users2, Star, TrendingUp } from 'lucide-react'

interface MembersStatsProps {
  totalMembers: number
  totalChildren: number
  totalIndividuals: number
  familyCount: number
  singleCount: number
  familiesWithChildren: number
  familiesWithoutChildren: number
  averageChildrenPerFamily: number
  maxChildrenInFamily: number
  summary: string
}

export default function MembersStats({ 
  totalMembers,
  totalChildren,
  totalIndividuals,
  familyCount,
  singleCount,
  familiesWithChildren,
  familiesWithoutChildren,
  averageChildrenPerFamily,
  maxChildrenInFamily,
  summary
}: MembersStatsProps) {
  
  const stats = [
    {
      title: 'Total Members',
      value: totalMembers,
      icon: Users,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-200',
      description: `${familyCount} families, ${singleCount} singles`
    },
    {
      title: 'Total Children',
      value: totalChildren,
      icon: Baby,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-200',
      description: `${familiesWithChildren} families with children`
    },
    {
      title: 'Total Individuals',
      value: totalIndividuals,
      icon: Users2,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      description: 'Members + Children'
    },
    {
      title: 'Families',
      value: familyCount,
      icon: Heart,
      color: 'rose',
      bgColor: 'bg-rose-100',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-200',
      description: `${familiesWithoutChildren} without children`
    },
    {
      title: 'Singles',
      value: singleCount,
      icon: User,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      description: 'Individual members'
    },
    {
      title: 'Avg Children/Family',
      value: averageChildrenPerFamily,
      icon: Star,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-200',
      description: `Max: ${maxChildrenInFamily} children`,
      isDecimal: true
    }
  ]

  return (
    <div className="space-y-4 mb-8">
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6" />
          <p className="text-sm font-medium opacity-90">Summary</p>
        </div>
        <p className="text-lg font-semibold mt-1">{summary}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <div
              key={index}
              className={`bg-white rounded-xl border ${stat.borderColor} p-4 hover:shadow-lg transition-all transform hover:-translate-y-1`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stat.isDecimal ? stat.value.toFixed(1) : stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate" title={stat.description}>
                  {stat.description}
                </p>
              </div>
              
              {/* Mini progress bar */}
              <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${stat.bgColor.replace('bg-', 'bg-')}`}
                  style={{ 
                    width: `${
                      stat.title === 'Total Members' ? (totalMembers / 50) * 100 :
                      stat.title === 'Total Children' ? (totalChildren / 30) * 100 :
                      stat.title === 'Total Individuals' ? (totalIndividuals / 80) * 100 :
                      stat.title === 'Families' ? (familyCount / 20) * 100 :
                      stat.title === 'Singles' ? (singleCount / 30) * 100 :
                      (averageChildrenPerFamily / 10) * 100
                    }%` 
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}