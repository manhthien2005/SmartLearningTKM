'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CloudBackground } from '@/components/ui'
import { RoleCard, LoginForm } from '@/components/auth'

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  const roles = [
    {
      id: 'teacher',
      lottieUrl: 'https://lottie.host/6af1a0cb-0e90-4487-86c6-37c988ce31b8/zGv3xRS8uU.lottie',
      title: 'Giảng Viên'
    },
    {
      id: 'student',
      lottieUrl: 'https://lottie.host/03d80606-d1be-4d83-aa5b-46825531cfec/q1Tk75e0es.lottie',
      title: 'Sinh Viên'
    }
  ]

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId)
  }

  const handleBack = () => {
    setSelectedRole(null)
  }

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <CloudBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-3">
              <img 
                src="/logo-slearn.png" 
                alt="Smart Learning Logo" 
                className="h-16 md:h-20 w-auto cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={handleLogoClick}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-education-dark mb-2" style={{ fontFamily: "'Lexend', sans-serif" }}>
              Hệ Thống Học Tập Thông Minh
            </h1>
            <p className="text-base md:text-lg text-gray-600 mt-4 md:mt-6 mb-2 px-4 md:px-0" style={{ fontFamily: "'Lexend', sans-serif" }}>
              Vui lòng chọn vai trò của bạn để tiếp tục
            </p>
          </motion.div>

          {/* Role Selection */}
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    layout
                    className={`transition-all duration-500 ${
                      selectedRole && selectedRole !== role.id 
                        ? 'opacity-0 scale-95' 
                        : 'opacity-100 scale-100'
                    }`}
                  >
                    <RoleCard
                      role={role.id}
                      lottieUrl={role.lottieUrl}
                      title={role.title}
                      isSelected={selectedRole === role.id}
                      onClick={handleRoleSelect}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="selected-role"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      opacity: selectedRole && selectedRole !== role.id ? 0.3 : 1,
                      scale: selectedRole && selectedRole !== role.id ? 0.95 : 1
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <RoleCard
                      role={role.id}
                      lottieUrl={role.lottieUrl}
                      title={role.title}
                      isSelected={selectedRole === role.id}
                      onClick={handleRoleSelect}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Login Form Overlay */}
      <AnimatePresence>
        {selectedRole && (
          <LoginForm
            selectedRole={selectedRole}
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

