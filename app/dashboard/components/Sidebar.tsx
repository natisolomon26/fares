// app/dashboard/components/Sidebar.tsx
'use client'

import { 
  BarChart3, Users, Calendar, DollarSign, MessageCircle, 
  FileText, Settings, Church, LogOut, BookOpen, Shield, 
  Music, Home, Bell, Heart, Video, UserPlus, FileCheck
} from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard' },
    { id: 'members', icon: Users, label: 'Members', path: '/dashboard/members' },
    { id: 'events', icon: Calendar, label: 'Events', path: '/dashboard/events' },
    { id: 'finances', icon: DollarSign, label: 'Finances', path: '/dashboard/finances' },
    { id: 'messages', icon: MessageCircle, label: 'Messages', path: '/dashboard/messages' },
    { id: 'sermons', icon: FileText, label: 'Sermons', path: '/dashboard/sermons' },
    { id: 'worship', icon: Music, label: 'Worship', path: '/dashboard/worship' },
    { id: 'studies', icon: BookOpen, label: 'Bible Studies', path: '/dashboard/studies' },
    { id: 'prayer', icon: Heart, label: 'Prayer Requests', path: '/dashboard/prayer' },
    { id: 'live', icon: Video, label: 'Live Streaming', path: '/dashboard/live' },
    { id: 'visitors', icon: UserPlus, label: 'Visitors', path: '/dashboard/visitors' },
    { id: 'reports', icon: FileCheck, label: 'Reports', path: '/dashboard/reports' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ]

  const bottomMenuItems = [
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: 3, path: '/dashboard/notifications' },
    { id: 'support', icon: Shield, label: 'Support', path: '/dashboard/support' },
  ]

  // Helper function to check if a menu item is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') return true
    if (path !== '/dashboard' && pathname.startsWith(path)) return true
    return false
  }

  return (
    <aside className={`h-screen bg-emerald-900 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} overflow-y-auto`}>
      <div className="p-6 h-full flex flex-col">
        {/* Logo */}
        <Link href="/dashboard" className={`flex items-center gap-3 mb-10 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="p-2 bg-emerald-900/30 rounded-xl border border-emerald-700/30 flex-shrink-0">
            <Church className="w-6 h-6 text-yellow-200" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">ChurchFlow</h1>
              <p className="text-xs text-emerald-100/60">Pastor Dashboard</p>
            </div>
          )}
        </Link>

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
            {menuItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
                    active 
                      ? 'bg-gradient-to-r from-yellow-200/80 to-yellow-200/90 text-emerald-900' 
                      : 'text-emerald-100/70 hover:bg-yellow-200/80 hover:text-emerald-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`w-5 h-5 ${
                    active ? 'text-emerald-800' : 'group-hover:text-emerald-900'
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Bottom Menu */}
          <div className={`mt-auto space-y-1 ${isCollapsed ? '' : 'pt-6 border-t border-white/10'}`}>
            {bottomMenuItems.map((item) => {
              const active = isActive(item.path)
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all group ${
                    active 
                      ? 'bg-gradient-to-r from-yellow-200/80 to-yellow-200/90 text-emerald-900' 
                      : 'text-emerald-100/70 hover:bg-yellow-200/80 hover:text-emerald-900'
                  } ${isCollapsed ? 'justify-center relative' : ''}`}
                >
                  <item.icon className={`w-5 h-5 ${
                    active ? 'text-emerald-800' : 'group-hover:text-emerald-900'
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
                </Link>
              )
            })}

            {/* Pastor Profile */}
            <div className={`mt-6 ${isCollapsed ? '' : 'flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-yellow-500/10 transition-all cursor-pointer group border border-white/10'}`}>
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                <span className="font-bold text-emerald-900">
                  {user?.email?.charAt(0).toUpperCase() || 'P'}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate group-hover:text-yellow-100">
                    {user?.email || 'Pastor'}
                  </p>
                  <p className="text-xs text-emerald-100/60 truncate group-hover:text-yellow-200/80">
                    {user?.church?.name || 'Church'}
                  </p>
                </div>
              )}
              <button 
                onClick={logout}
                className="w-4 h-4 text-emerald-100/60 group-hover:text-yellow-200/80 flex-shrink-0 hover:scale-110 transition-transform"
              >
                <LogOut className="w-4 h-4" />
              </button>
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-emerald-900/80 backdrop-blur-sm rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  <div>{user?.email || 'Pastor'}</div>
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