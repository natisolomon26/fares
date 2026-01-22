// app/dashboard/page.tsx
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import StatsCard from './components/StatsCard'
import QuickActions from './components/QuickActions'
import UpcomingEvents from './components/UpcomingEvents'
import RecentActivity from './components/RecentActivity'
import ChurchHealth from './components/ChurchHealth'

export default function DashboardPage() {
  const stats = [
    { title: 'Total Members', value: '1,245', change: '+12%', icon: Users, color: 'bg-emerald-100' },
    { title: 'Weekly Attendance', value: '856', change: '+8%', icon: Users, color: 'bg-blue-100' },
    { title: 'Monthly Giving', value: '$24,580', change: '+15%', icon: DollarSign, color: 'bg-yellow-100' },
    { title: 'Active Volunteers', value: '128', change: '+5%', icon: Users, color: 'bg-purple-100' },
  ]

  return (
    <div className="p-4 lg:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <QuickActions />
          <UpcomingEvents />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-4 lg:space-y-6">
          <RecentActivity />
          <ChurchHealth />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Today's Verse */}
        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6">
          <h3 className="font-bold text-gray-800 mb-3 lg:mb-4 flex items-center gap-2">
            <span className="p-2 bg-emerald-100 rounded-lg">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            </span>
            Today's Verse
          </h3>
          <p className="italic text-gray-600 text-sm lg:text-base mb-3">
            "Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the Lord."
          </p>
          <p className="text-sm text-emerald-600 font-medium">— 1 Corinthians 15:58</p>
        </div>

        {/* Birthdays */}
        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6">
          <h3 className="font-bold text-gray-800 mb-3 lg:mb-4">Birthdays This Week</h3>
          <div className="space-y-3">
            {['Sarah Johnson', 'Michael Brown', 'Lisa Wilson'].map((name, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center">
                  <span className="font-bold text-white text-sm">{name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm lg:text-base">{name}</p>
                  <p className="text-xs text-gray-500">Tomorrow</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 p-4 lg:p-6">
          <h3 className="font-bold text-gray-800 mb-3 lg:mb-4">Quick Stats</h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm lg:text-base">New Members This Month</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                24
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm lg:text-base">Prayer Requests</span>
              <span className="font-bold text-blue-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm lg:text-base">Upcoming Events</span>
              <span className="font-bold text-purple-600">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm lg:text-base">Sermons This Month</span>
              <span className="font-bold text-amber-600">4</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}