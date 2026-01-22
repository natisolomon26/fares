// app/dashboard/components/RecentActivity.tsx
import { User, DollarSign, Users, MessageCircle, Bell } from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    { user: 'John Smith', action: 'joined the church', time: '2 hours ago', icon: User, color: 'bg-emerald-100 text-emerald-600' },
    { user: 'Sarah Johnson', action: 'made a donation', time: '4 hours ago', icon: DollarSign, color: 'bg-yellow-100 text-yellow-600' },
    { user: 'Mark Davis', action: 'signed up for volunteering', time: '1 day ago', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { user: 'Prayer Team', action: 'prayer request submitted', time: '1 day ago', icon: Bell, color: 'bg-purple-100 text-purple-600' },
    { user: 'Worship Team', action: 'updated service playlist', time: '2 days ago', icon: MessageCircle, color: 'bg-pink-100 text-pink-600' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${activity.color}`}>
              <activity.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{activity.user}</span>
                <span className="text-gray-600"> {activity.action}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity