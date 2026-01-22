// app/dashboard/components/UpcomingEvents.tsx
import { Calendar, Clock, MapPin } from 'lucide-react'

const UpcomingEvents = () => {
  const events = [
    { title: 'Sunday Service', time: '9:00 AM', date: 'Today', type: 'service', location: 'Main Sanctuary' },
    { title: 'Bible Study', time: '7:00 PM', date: 'Tomorrow', type: 'study', location: 'Chapel' },
    { title: 'Youth Group', time: '6:30 PM', date: 'Wednesday', type: 'youth', location: 'Youth Center' },
    { title: 'Prayer Meeting', time: '7:00 PM', date: 'Thursday', type: 'prayer', location: 'Prayer Room' },
    { title: 'Men\'s Breakfast', time: '8:00 AM', date: 'Saturday', type: 'fellowship', location: 'Fellowship Hall' },
  ]

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'service': return 'bg-emerald-100 text-emerald-700'
      case 'study': return 'bg-blue-100 text-blue-700'
      case 'youth': return 'bg-purple-100 text-purple-700'
      case 'prayer': return 'bg-amber-100 text-amber-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
        <button className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors font-medium">
          View Calendar →
        </button>
      </div>
      <div className="space-y-4">
        {events.map((event, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all group">
            <div className="flex items-start gap-4">
              <div className="text-center min-w-16">
                <div className="text-xs text-gray-500 uppercase">{event.date}</div>
                <div className="flex items-center gap-1 mt-1 text-lg font-bold text-gray-800">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  {event.time}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">{event.title}</h4>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 opacity-0 group-hover:opacity-100 transition-all">
              <Calendar className="w-4 h-4 text-gray-600 hover:text-emerald-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpcomingEvents