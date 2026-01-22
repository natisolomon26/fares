// app/dashboard/components/Sidebar.tsx
'use client'

import { 
  BarChart3, Users, Calendar, DollarSign, MessageCircle, 
  FileText, Settings, Church, LogOut, BookOpen, Shield, 
  Music, Home, Bell, Heart, Video, UserPlus, FileCheck
} from 'lucide-react'
import { useState } from 'react'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'members', icon: Users, label: 'Members' },
    { id: 'events', icon: Calendar, label: 'Events' },
    { id: 'finances', icon: DollarSign, label: 'Finances' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'sermons', icon: FileText, label: 'Sermons' },
    { id: 'worship', icon: Music, label: 'Worship' },
    { id: 'studies', icon: BookOpen, label: 'Bible Studies' },
    { id: 'prayer', icon: Heart, label: 'Prayer Requests' },
    { id: 'live', icon: Video, label: 'Live Streaming' },
    { id: 'visitors', icon: UserPlus, label: 'Visitors' },
    { id: 'reports', icon: FileCheck, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  const bottomMenuItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3 },
    { id: 'support', icon: Shield, label: 'Support' },
  ]

  return (
    <aside className={`h-screen bg-emerald-900 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} overflow-y-auto`}>
      <div className="p-6 h-full flex flex-col">
        {/* Logo */}
        <div className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-emerald-900/30 rounded-xl border border-emerald-700/30 flex-shrink-0">
            <Church className="w-6 h-6 text-yellow-200" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">ChurchFlow</h1>
              <p className="text-xs text-emerald-100/60">Pastor Dashboard</p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 bg-emerald-900/50 backdrop-blur-sm border border-emerald-700/30 p-2 rounded-full transition-all hover:bg-yellow-500/20 hover:border-yellow-500/30 hover:scale-110 ${isCollapsed ? 'lg:-right-3' : 'lg:hidden'}`}
        >
          <div className={`w-4 h-4 border-l-2 border-t-2 border-white transform ${isCollapsed ? 'rotate-45' : '-rotate-135'}`}></div>
        </button>

        {/* Navigation */}
        <nav className="flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
                  activeMenu === item.id 
                    ? 'bg-gradient-to-r from-yellow-200/80 to-yellow-200/90 text-emerald-900' 
                    : 'text-emerald-100/70 hover:bg-yellow-200/80 hover:text-emerald-900 '
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${
                  activeMenu === item.id ? 'text-emerald-800' : 'group-hover:text-emerald-900'
                }`} />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Bottom Menu */}
          <div className={`mt-auto space-y-1 ${isCollapsed ? '' : 'pt-6 border-t border-white/10'}`}>
            {bottomMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
                  activeMenu === item.id 
                    ? 'bg-gradient-to-r from-yellow-200/80 to-yellow-200/90 text-emerald-900' 
                    : 'text-emerald-100/70 hover:bg-yellow-200/80 hover:text-emerald-900'
                } ${isCollapsed ? 'justify-center relative' : ''}`}
              >
                <item.icon className={`w-5 h-5 ${
                  activeMenu === item.id ? 'text-emerald-800' : 'group-hover:text-emerald-900'
                }`} />
                {!isCollapsed && (
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
                {isCollapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </button>
            ))}

            {/* Pastor Profile */}
            <div className={`mt-6 ${isCollapsed ? '' : 'flex items-center gap-3 p-3 rounded-xl hover:bg-yellow-200/80 transition-all cursor-pointer group'}`}>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                <span className="font-bold text-emerald-900">P</span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate group-hover:text-emerald-900">Pastor John</p>
                    <p className="text-xs text-emerald-100/60 truncate group-hover:text-emerald-800">Grace Community Church</p>
                  </div>
                  <LogOut className="w-4 h-4 text-emerald-100/60 group-hover:text-emerald-800 flex-shrink-0" />
                </>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  <div>Pastor John</div>
                  <div className="text-xs text-emerald-100/60">Sign Out</div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar