'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import OTPVerification from './OTPVerification'
import ForgotPasswordModal from './ForgotPasswordModal'

// Type declaration for dotlottie-wc Web Component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-wc': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string
        autoplay?: boolean | string
        loop?: boolean | string
        background?: string
        speed?: string | number
        mode?: string
      }
    }
  }
}

interface LoginFormProps {
  selectedRole: string
  onBack: () => void
}

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

interface RoleInfo {
  title: string
  lottieUrl: string
  loginText: string
  registerTitle: string
  registerText: string
}

const LoginForm: React.FC<LoginFormProps> = ({ selectedRole, onBack }) => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showForgotPasswordOTP, setShowForgotPasswordOTP] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [screenSize, setScreenSize] = useState<'small' | 'medium' | 'desktop'>('small')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width >= 768) {
        setScreenSize('desktop')
      } else if (width >= 480) {
        setScreenSize('medium')
      } else {
        setScreenSize('small')
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const roleInfo: Record<string, RoleInfo> = {
    teacher: {
      title: 'Giảng viên',
      lottieUrl: 'https://lottie.host/6af1a0cb-0e90-4487-86c6-37c988ce31b8/zGv3xRS8uU.lottie',
      loginText: 'Đăng nhập để quản lý lớp học',
      registerTitle: 'Chào mừng đến SLearn',
      registerText: 'Đăng ký để tạo khoá học'
    },
    student: {
      title: 'Sinh viên',
      lottieUrl: 'https://lottie.host/03d80606-d1be-4d83-aa5b-46825531cfec/q1Tk75e0es.lottie',
      loginText: 'Đăng nhập để tiếp tục học tập',
      registerTitle: 'Chào mừng đến SLearn',
      registerText: 'Đăng ký để mở khoá tri thức'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent spam clicks
    if (isLoading) return

    setIsLoading(true)

    try {
      if (isLogin) {
        // Handle Login
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock successful login
        toast.success('Đăng nhập thành công!', {
          position: 'bottom-right',
          duration: 3000,
          icon: '🎉',
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '500',
            borderRadius: '12px',
            padding: '16px',
          },
        })

        // Redirect based on role after short delay
        setTimeout(() => {
          if (selectedRole === 'student') {
            router.push('/student')
          } else if (selectedRole === 'teacher') {
            router.push('/teacher')
          }
        }, 1000)
      } else {
        // Handle Register - only show OTP for students
        if (selectedRole === 'student') {
          // Validate password confirmation
          if (formData.password !== formData.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!', {
              position: 'bottom-right',
              duration: 3000,
            })
            setIsLoading(false)
            return
          }

          // TODO: Replace with actual API call to send OTP
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Show OTP verification
          setShowOTP(true)
          
          toast.success('Mã OTP đã được gửi đến email của bạn', {
            position: 'bottom-right',
            duration: 3000,
            style: {
              background: '#0ea5e9',
              color: '#fff',
              fontWeight: '500',
              borderRadius: '12px',
              padding: '16px',
            },
          })
          setIsLoading(false)
        } else {
          // For teacher - direct registration without OTP
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          toast.success('Đăng ký thành công!', {
            position: 'bottom-right',
            duration: 3000,
            icon: '🎉',
          })

          setTimeout(() => {
            router.push('/teacher')
          }, 1000)
        }
      }
    } catch (error) {
      setIsLoading(false)
      
      toast.error(isLogin ? 'Đăng nhập thất bại!' : 'Đăng ký thất bại!', {
        position: 'bottom-right',
        duration: 4000,
        style: {
          background: '#ef4444',
          color: '#fff',
          fontWeight: '500',
          borderRadius: '12px',
          padding: '16px',
        },
      })
    }
  }

  const handleOTPSuccess = () => {
    toast.success('Xác thực thành công! Chào mừng đến với SLearn', {
      position: 'bottom-right',
      duration: 3000,
      icon: '✅',
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '12px',
        padding: '16px',
      },
    })

    // Redirect to student dashboard
    setTimeout(() => {
      router.push('/student')
    }, 500)
  }

  const handleOTPBack = () => {
    setShowOTP(false)
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleForgotPasswordSubmit = (email: string) => {
    setForgotPasswordEmail(email)
    setShowForgotPassword(false)
    setShowForgotPasswordOTP(true)
  }

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false)
  }

  const handleForgotPasswordOTPSuccess = () => {
    toast.success('Xác thực thành công!', {
      position: 'bottom-right',
      duration: 3000,
      icon: '✅',
      style: {
        background: '#10b981',
        color: '#fff',
        fontWeight: '500',
        borderRadius: '12px',
        padding: '16px',
      },
    })

    // TODO: Redirect to reset password page or show reset password modal
    setShowForgotPasswordOTP(false)
    toast('Chức năng đặt lại mật khẩu sẽ được triển khai sau', {
      position: 'bottom-right',
      duration: 4000,
      icon: 'ℹ️',
    })
  }

  const handleForgotPasswordOTPBack = () => {
    setShowForgotPasswordOTP(false)
    setShowForgotPassword(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed inset-0 z-30 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)'
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`relative w-full h-full md:w-[750px] md:h-auto bg-white md:rounded-3xl shadow-2xl md:m-4 ${
          !isLogin ? 'md:h-[580px]' : 'md:h-[540px]'
        } overflow-y-auto md:overflow-hidden`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.25), 0 0 0 1px rgba(14, 165, 233, 0.1)'
        }}
      >
        <div className="flex flex-col md:flex-row h-full md:h-full min-h-full">
          {/* Back button */}
          <motion.button
            whileHover={!isLoading ? { scale: 1.1 } : {}}
            whileTap={!isLoading ? { scale: 0.9 } : {}}
            onClick={onBack}
            disabled={isLoading}
            className={`absolute top-6 right-6 z-10 p-2 rounded-full transition-all duration-200 ${
              isLoading ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Left side - Animation */}
          <div className="w-full md:w-[48%] bg-gradient-to-br from-education-light to-primary-100 flex flex-col items-center justify-center py-4 md:py-8 min-h-[30vh] md:min-h-0">
            {/* SLearn Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mb-6 md:mb-8 mt-4 md:mt-0"
            >
              <img 
                src="/logo-slearn.png" 
                alt="SLearn" 
                className="h-8 md:h-10 w-auto object-contain"
                onError={(e) => {
                  // Fallback nếu không có logo
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const nextSibling = target.nextSibling as HTMLElement
                  if (nextSibling) {
                    nextSibling.style.display = 'block'
                  }
                }}
              />
              <div className="hidden text-2xl font-bold text-education-dark">
                SLearn
              </div>
            </motion.div>
            
            {/* Role Animation */}
            <motion.div 
              initial={{ scale: 0.8, rotate: -30, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              className="flex-1 flex items-center justify-center min-h-0"
              style={{
                maxWidth: screenSize === 'desktop' 
                  ? (selectedRole === 'teacher' ? '280px' : '300px')
                  : '160px',
                maxHeight: screenSize === 'desktop' 
                  ? (selectedRole === 'teacher' ? '280px' : '300px')
                  : '160px',
                aspectRatio: '1/1'
              }}
            >
              <dotlottie-wc 
                src={roleInfo[selectedRole]?.lottieUrl} 
                className={`lottie-icon ${selectedRole}`}
                data-role={selectedRole}
                autoplay 
                loop
                background="transparent"
                speed="1"
                mode="normal"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: screenSize === 'desktop' 
                    ? (selectedRole === 'teacher' ? '280px' : '300px')
                    : '160px',
                  maxHeight: screenSize === 'desktop' 
                    ? (selectedRole === 'teacher' ? '280px' : '300px')
                    : '160px',
                  display: 'block',
                  overflow: 'hidden',
                  objectFit: 'contain'
                }}
              />
            </motion.div>
            
            {/* Copyright */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center mt-6 md:mt-8 mb-4 md:mb-0"
            >
              <p className="text-xs text-education-dark/70 font-medium">
                © by team TKM - 2025 with <span className="text-red-500">❤</span>
              </p>
            </motion.div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-[52%] p-4 md:p-6 flex flex-col min-h-[70vh] md:min-h-0">

            {/* Header */}
            <motion.div 
              key={`header-${isLogin}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-education-light to-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-2xl">
                    {selectedRole === 'teacher' ? '👨‍🏫' : '🎓'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {!isLogin ? roleInfo[selectedRole]?.registerTitle : 'Chào mừng trở lại!'}
                  </h3>
                  <p className="text-sm text-education-main font-medium">
                    {roleInfo[selectedRole]?.title}
                  </p>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {isLogin 
                  ? roleInfo[selectedRole]?.loginText 
                  : roleInfo[selectedRole]?.registerText
                }
              </p>
            </motion.div>

            {/* Login/Register Toggle */}
            <div className="mb-4">
              <div className="relative bg-gray-100 rounded-xl p-1">
                <motion.div
                  className="absolute top-1 h-10 bg-education-main rounded-lg shadow-md"
                  initial={false}
                  animate={{
                    left: isLogin ? '4px' : '50%',
                    width: 'calc(50% - 4px)'
                  }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className="relative flex">
                  <button
                    onClick={() => setIsLogin(true)}
                    disabled={isLoading}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      isLogin ? 'text-white' : 'text-gray-700'
                    } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    disabled={isLoading}
                    className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 ${
                      !isLogin ? 'text-white' : 'text-gray-700'
                    } ${isLoading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className={`flex-1 flex flex-col ${!isLogin ? 'space-y-3 md:space-y-4' : 'space-y-4 md:space-y-5'}`}
            >
              {/* Full Name (only for register) */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-education-main focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    placeholder="Nhập họ và tên của bạn"
                    required={!isLogin}
                  />
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-education-main focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="example@domain.com"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-education-main focus:border-transparent transition-all duration-200 placeholder-gray-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password (only for register) */}
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-education-main focus:border-transparent transition-all duration-200 placeholder-gray-500"
                        placeholder="••••••••"
                        required={!isLogin}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember Me (only for login) */}
              {isLogin && (
                <div className="flex items-center mb-2 md:mb-3">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-education-main bg-gray-100 border-gray-300 rounded focus:ring-education-main focus:ring-2"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700 select-none cursor-pointer">
                    Ghi nhớ đăng nhập
                  </label>
                </div>
              )}
              
              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.4), 0 4px 6px -2px rgba(14, 165, 233, 0.1)"
                } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg mb-3 md:mb-4 flex items-center justify-center gap-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-education-main to-primary-600 text-white hover:from-education-dark hover:to-primary-700'
                }`}
              >
                {isLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{isLoading ? 'Đang xử lý...' : (isLogin ? 'Đăng nhập' : 'Đăng ký')}</span>
              </motion.button>

              {/* Forgot Password (only for login) */}
              {isLogin && (
                <motion.button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={!isLoading ? { 
                    scale: 1.02,
                    boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.1)"
                  } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 mb-4 md:mb-6 ${
                    isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Quên mật khẩu?
                </motion.button>
              )}

            </motion.form>
          </div>

        </div>
      </motion.div>

      {/* OTP Verification Modal (for Register) */}
      <AnimatePresence>
        {showOTP && (
          <OTPVerification
            email={formData.email}
            onSuccess={handleOTPSuccess}
            onBack={handleOTPBack}
          />
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <ForgotPasswordModal
            onClose={handleForgotPasswordClose}
            onSubmit={handleForgotPasswordSubmit}
          />
        )}
      </AnimatePresence>

      {/* OTP Verification Modal (for Forgot Password) */}
      <AnimatePresence>
        {showForgotPasswordOTP && (
          <OTPVerification
            email={forgotPasswordEmail}
            onSuccess={handleForgotPasswordOTPSuccess}
            onBack={handleForgotPasswordOTPBack}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default LoginForm
