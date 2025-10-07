'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface OTPVerificationProps {
  email: string
  onSuccess: () => void
  onBack: () => void
  rememberDevice?: boolean
  deviceToken?: string
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, onSuccess, onBack, rememberDevice, deviceToken }) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', ''])
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  useEffect(() => {
    if (countdown > 0 && !canResend) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCanResend(true)
    }
  }, [countdown, canResend])

  const handleChange = (index: number, value: string) => {
    if (isVerifying || status !== 'idle') return

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char
      }
    })

    setOtp(newOtp)

    // Focus last filled input or first empty
    const lastIndex = Math.min(pastedData.length, 5)
    inputRefs.current[lastIndex]?.focus()

    // Auto-verify if complete
    if (newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp)
    }
  }

  const handleVerify = async (otpToVerify: string[]) => {
    setIsVerifying(true)
    const otpCode = otpToVerify.join('')

    try {
      // Call email verification API
      const response = await fetch('/api/auth/email-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
          rememberDevice: rememberDevice,
          deviceToken: deviceToken,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Success animation
        setStatus('success')
        
        // Wait for animation to complete
        setTimeout(() => {
          onSuccess()
        }, 3000)
      } else {
        // Error animation
        setStatus('error')
        toast.error(data.message || 'Mã OTP không chính xác', {
          position: 'bottom-right',
          duration: 4000,
          style: {
            background: '#ef4444',
            color: '#fff',
            fontWeight: '500',
          },
        })

        // Reset after animation
        setTimeout(() => {
          setStatus('idle')
          setOtp(['', '', '', '', '', ''])
          setIsVerifying(false)
          inputRefs.current[0]?.focus()
        }, 1500)
      }
    } catch (error) {
      setStatus('error')
      toast.error('Có lỗi xảy ra, vui lòng thử lại', {
        position: 'bottom-right',
        duration: 4000,
      })
      
      setTimeout(() => {
        setStatus('idle')
        setOtp(['', '', '', '', '', ''])
        setIsVerifying(false)
        inputRefs.current[0]?.focus()
      }, 1500)
    }
  }

  const handleResend = async () => {
    if (!canResend || isResending) return

    setIsResending(true)

    try {
      // Call resend OTP API
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Đã gửi lại mã OTP', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '500',
          },
        })

        setCountdown(30)
        setCanResend(false)
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      } else {
        toast.error(data.message || 'Không thể gửi lại OTP', {
          position: 'bottom-right',
          duration: 3000,
        })
      }
    } catch (error) {
      toast.error('Không thể gửi lại OTP', {
        position: 'bottom-right',
        duration: 3000,
      })
    } finally {
      setIsResending(false)
    }
  }

  const getInputClassName = (index: number) => {
    const baseClass = "w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-300 focus:outline-none bg-white"
    
    if (status === 'success') {
      return `${baseClass} border-green-500 text-green-600`
    } else if (status === 'error') {
      return `${baseClass} border-red-500 text-red-600 animate-shake`
    } else if (otp[index]) {
      return `${baseClass} border-education-main text-education-dark`
    } else {
      return `${baseClass} border-gray-300 text-gray-700 focus:border-education-main focus:ring-2 focus:ring-education-main/20`
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
          onClick={onBack}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isVerifying || isResending}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-education-light to-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-education-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực Email</h2>
          <p className="text-gray-600 text-sm">
            Nhập mã OTP đã được gửi đến
          </p>
          <p className="text-education-main font-semibold mt-1">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1
                }}
                transition={{ 
                  delay: index * 0.05,
                  duration: 0.2
                }}
              >
                <input
                  ref={(el) => { inputRefs.current[index] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className={getInputClassName(index)}
                  disabled={isVerifying || status !== 'idle'}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resend OTP */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className={`font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto ${
                isResending ? 'text-gray-400 cursor-not-allowed' : 'text-education-main hover:text-education-dark'
              }`}
            >
              {isResending && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isResending ? 'Đang gửi...' : 'Gửi lại mã OTP'}</span>
            </button>
          ) : (
            <p className="text-gray-600">
              Gửi lại mã sau{' '}
              <span className="font-semibold text-education-main">
                {countdown}s
              </span>
            </p>
          )}
        </div>

        {/* Helper text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Không nhận được mã? Kiểm tra hộp thư spam hoặc{' '}
          <button 
            onClick={handleResend} 
            disabled={!canResend || isResending}
            className={`underline ${canResend && !isResending ? 'text-education-main hover:text-education-dark' : 'text-gray-400 cursor-not-allowed'}`}
          >
            {isResending ? 'đang gửi...' : 'gửi lại'}
          </button>
        </p>
      </motion.div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </motion.div>
  )
}

export default OTPVerification

