// app/dashboard/components/StatsCard.tsx
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

const StatsCard = ({ title, value, change, icon: Icon, color }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6 hover:border-emerald-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3 lg:mb-4">
        <div className={`p-2 lg:p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 lg:px-3 py-1 rounded-full">
          <span>{change}</span>
        </div>
      </div>
      <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  )
}

export default StatsCard