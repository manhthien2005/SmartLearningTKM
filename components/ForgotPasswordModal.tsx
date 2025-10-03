'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface ForgotPasswordModalProps {
  onClose: () => void
  onSubmit: (email: string) => void
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Vui lòng nhập email hợp lệ', {
        position: 'bottom-right',
        duration: 3000,
      })
      return
    }

    if (isLoading) return

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
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

      onSubmit(email)
    } catch (error) {
      toast.error('Không thể gửi mã OTP!', {
        position: 'bottom-right',
        duration: 4000,
      })
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Back button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200 ${
            isLoading ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-education-light to-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-education-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quên mật khẩu?</h2>
          <p className="text-gray-600 text-sm">
            Nhập email của bạn để nhận mã xác thực
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-education-main focus:border-transparent transition-all duration-200 placeholder-gray-500"
              placeholder="example@domain.com"
              required
              disabled={isLoading}
            />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={!isLoading ? { 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.4), 0 4px 6px -2px rgba(14, 165, 233, 0.1)"
            } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg flex items-center justify-center gap-2 ${
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
            <span>{isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}</span>
          </motion.button>
        </form>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Nhớ mật khẩu?{' '}
          <button 
            onClick={onClose}
            disabled={isLoading}
            className={`font-medium ${
              isLoading ? 'text-gray-400 cursor-not-allowed' : 'text-education-main hover:text-education-dark'
            }`}
          >
            Đăng nhập
          </button>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ForgotPasswordModal

