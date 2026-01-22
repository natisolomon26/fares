// app/dashboard/components/Header.tsx - Updated with user info
'use client'

import { Bell, Search, Calendar, Menu, ChevronDown, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'

interface HeaderProps {
  onMenuToggle?: () => void
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { user, logout } = useAuth()
  const [time, setTime] = useState('')
  const [greeting, setGreeting] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, '0')
      setTime(`${hours}:${minutes}`)
      
      if (hours < 12) setGreeting('Good Morning')
      else if (hours < 18) setGreeting('Good Afternoon')
      else setGreeting('Good Evening')
    }
    
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const getCurrentDate = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/90 backdrop-blur-xl border-b border-emerald-800/50 shadow-lg shadow-emerald-900/20">
      <div className="px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <button 
              onClick={onMenuToggle}
              className="lg:hidden p-2.5 rounded-xl bg-emerald-800/50 hover:bg-yellow-500/20 border border-emerald-700/30 hover:border-yellow-500/30 text-yellow-200 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Greeting and Date */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <h1 className="text-xl lg:text-2xl font-bold text-yellow-200">
                  {greeting}, <span className="text-white">Pastor</span>
                </h1>
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                  <Calendar className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-yellow-100">{time}</span>
                </div>
              </div>
              <p className="text-sm text-emerald-100/70 mt-1">
                {getCurrentDate()}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-yellow-200/70" />
              <input
                type="text"
                placeholder="Search members, sermons, events..."
                className="pl-12 pr-4 py-3 bg-emerald-800/40 border border-emerald-700/30 rounded-xl text-yellow-100 placeholder-yellow-200/50 focus:outline-none focus:border-yellow-300/50 focus:ring-2 focus:ring-yellow-300/20 w-64 backdrop-blur-sm"
              />
            </div>

            {/* Mobile Search */}
            <button className="lg:hidden p-2.5 rounded-xl bg-emerald-800/50 hover:bg-yellow-500/20 border border-emerald-700/30 hover:border-yellow-500/30 text-yellow-200 transition-all">
              <Search className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2.5 rounded-xl bg-emerald-800/50 hover:bg-yellow-500/20 border border-emerald-700/30 hover:border-yellow-500/30 text-yellow-200 transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-xs font-bold text-white flex items-center justify-center border-2 border-emerald-900">
                  3
                </span>
              </button>
            </div>

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-3 pr-2 py-2 rounded-xl bg-emerald-800/50 hover:bg-yellow-500/20 border border-emerald-700/30 hover:border-yellow-500/30 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
                      <span className="font-bold text-emerald-900 text-sm">
                        {user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="font-semibold text-yellow-100">{user.email}</p>
                      <p className="text-xs text-emerald-100/60 group-hover:text-yellow-200/80">
                        {user.church?.name || 'No church assigned'}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-yellow-200/70 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-emerald-900/95 backdrop-blur-xl rounded-xl border border-emerald-800/50 shadow-2xl shadow-black/30 py-2 z-20">
                      <div className="px-4 py-3 border-b border-emerald-800/30">
                        <p className="font-semibold text-yellow-100">{user.email}</p>
                        <p className="text-sm text-emerald-100/60">{user.church?.name || 'No church assigned'}</p>
                      </div>
                      <div className="py-2">
                        <button className="flex items-center gap-3 w-full px-4 py-2.5 text-emerald-100/80 hover:text-red-300 hover:bg-red-500/10 transition-all" onClick={handleLogout}>
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Bar - Desktop Only */}
        <div className="hidden lg:flex items-center gap-6 mt-4 pt-4 border-t border-emerald-800/30">
          <div className="flex items-center gap-2">
            <div className="text-sm text-emerald-100/60">Church:</div>
            <div className="font-semibold text-yellow-300">{user?.church?.name || 'Not assigned'}</div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-sm text-emerald-100/60">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header