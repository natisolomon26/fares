// app/dashboard/components/ChurchHealth.tsx
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const ChurchHealth = () => {
  const metrics = [
    { label: 'Member Growth', value: 85, change: '+12%', color: 'bg-emerald-500' },
    { label: 'Engagement Rate', value: 72, change: '+8%', color: 'bg-blue-500' },
    { label: 'Giving Consistency', value: 91, change: '+5%', color: 'bg-yellow-500' },
    { label: 'Volunteer Rate', value: 68, change: '+15%', color: 'bg-purple-500' },
  ]

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Church Health</h2>
      </div>
      <div className="space-y-6">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">{metric.label}</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                {metric.change.startsWith('+') ? (
                  <TrendingUp className="w-4 h-4" />
                ) : metric.change.startsWith('-') ? (
                  <TrendingDown className="w-4 h-4" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                {metric.change}
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${metric.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">{metric.value}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChurchHealth