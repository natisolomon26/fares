// app/dashboard/components/QuickActions.tsx
import { Music, BookOpen, MessageCircle, FileText, Users, Calendar } from 'lucide-react'

const QuickActions = () => {
  const actions = [
    { title: 'Plan Service', icon: Music, color: 'bg-blue-50 text-blue-600' },
    { title: 'Write Sermon', icon: BookOpen, color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Send Message', icon: MessageCircle, color: 'bg-purple-50 text-purple-600' },
    { title: 'View Reports', icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { title: 'Add Member', icon: Users, color: 'bg-cyan-50 text-cyan-600' },
    { title: 'Schedule Event', icon: Calendar, color: 'bg-pink-50 text-pink-600' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium">
          View All →
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all group"
          >
            <div className={`p-3 rounded-lg mb-3 ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="font-medium text-sm text-gray-700 text-center">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions