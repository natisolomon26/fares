// app/auth/page.tsx
'use client'

import { useState } from 'react'
import { Eye, EyeOff, Church, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/app/context/AuthContext'

export default function AuthPage() {
  const { login, register, isLoading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    churchName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields')
      return
    }

    if (!isLogin && !formData.churchName) {
      setError('Church name is required for registration')
      return
    }

    // Make API call
    let result
    if (isLogin) {
      result = await login(formData.email, formData.password)
    } else {
      result = await register(formData.email, formData.password, formData.churchName)
    }

    if (!result.success) {
      setError(result.message || 'Authentication failed')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-gray-900 to-emerald-950 flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-yellow-200/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* Left Side - Bible Verse & Introduction */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="mb-10 lg:mb-0">
            {/* Logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
              <div className="p-3 bg-emerald-900/30 backdrop-blur-sm rounded-2xl border border-emerald-700/30">
                <Church className="w-10 h-10 text-yellow-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-300 bg-clip-text text-transparent">
                  ChurchFlow
                </h1>
                <p className="text-emerald-100/70 text-sm">Shepherd Your Flock Digitally</p>
              </div>
            </div>
            
            {/* Bible Verse Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-8 max-w-lg mx-auto lg:mx-0">
              <div className="text-yellow-200 mb-4">
                <svg className="w-8 h-8 mx-auto lg:mx-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6Z" />
                </svg>
              </div>
              <p className="text-2xl italic text-white mb-4 leading-relaxed">
                "I am the good shepherd. The good shepherd lays down his life for the sheep."
              </p>
              <p className="text-emerald-100/60 font-medium">— John 10:11</p>
            </div>

            {/* Introduction */}
            <div className="space-y-4 max-w-lg mx-auto lg:mx-0">
              <h2 className="text-2xl font-bold text-white">
                For Pastors, By Design
              </h2>
              <p className="text-emerald-100/70 leading-relaxed">
                ChurchFlow is designed specifically for pastors to manage their church operations with ease. 
                Focus on your ministry while we handle the administrative tasks.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-sm text-emerald-100/50">
                  Trusted by over 500 churches worldwide
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 overflow-hidden">
            
            {/* Form Header */}
            <div className="p-8 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {isLogin ? 'Welcome Back, Pastor' : 'Start Your Journey'}
                  </h2>
                  <p className="text-emerald-100/60 text-sm mt-1">
                    {isLogin ? 'Access your ministry dashboard' : 'Create your pastor account'}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/30 border border-emerald-700/30">
                  <User className="w-4 h-4 text-yellow-200" />
                  <span className="text-xs font-medium text-white">Pastor</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex mb-6 p-1 rounded-xl bg-emerald-900/30 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-center font-medium transition-all text-sm ${isLogin 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow' 
                    : 'text-emerald-100/70 hover:text-white'}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-center font-medium transition-all text-sm ${!isLogin 
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow' 
                    : 'text-emerald-100/70 hover:text-white'}`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 pt-0">
              <div className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-200">{error}</p>
                  </div>
                )}

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400/70" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-emerald-100/40 focus:outline-none focus:border-yellow-200/50 focus:ring-1 focus:ring-yellow-200/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="pastor@yourchurch.org"
                      required
                    />
                  </div>
                </div>

                {/* Church Name (Sign Up only) */}
                {!isLogin && (
                  <div className="group">
                    <label className="block text-sm font-medium text-emerald-100/80 mb-2">
                      Church Name
                    </label>
                    <div className="relative">
                      <Church className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400/70" />
                      <input
                        type="text"
                        name="churchName"
                        value={formData.churchName}
                        onChange={handleChange}
                        disabled={isLoading}
                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-emerald-100/40 focus:outline-none focus:border-yellow-200/50 focus:ring-1 focus:ring-yellow-200/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Grace Community Church"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                {/* Password */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-emerald-100/80">
                      Password
                    </label>
                    {isLogin && (
                      <button 
                        type="button" 
                        className="text-xs text-yellow-200 hover:text-yellow-300 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-400/70" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-emerald-100/40 focus:outline-none focus:border-yellow-200/50 focus:ring-1 focus:ring-yellow-200/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/70 hover:text-yellow-200 transition-colors disabled:opacity-50"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {!isLogin && (
                    <p className="mt-1 text-xs text-emerald-100/50">
                      Minimum 8 characters with letters and numbers
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-900/30 hover:shadow-emerald-900/40 transition-all duration-300 mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to Dashboard' : 'Create Account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Switch Form Link */}
                <p className="text-center text-sm text-emerald-100/60 pt-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin)
                      setError('')
                    }}
                    disabled={isLoading}
                    className="ml-1 font-semibold text-yellow-200 hover:text-yellow-300 transition-colors disabled:opacity-50"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>

                {/* Terms */}
                <p className="text-center text-xs text-emerald-100/40 pt-4">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-yellow-200/80 hover:text-yellow-200">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-yellow-200/80 hover:text-yellow-200">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}