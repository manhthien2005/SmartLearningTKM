'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface RoleCardProps {
  role: string
  lottieUrl: string
  title: string
  isSelected: boolean
  onClick: (role: string) => void
  index: number
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  lottieUrl, 
  title, 
  isSelected, 
  onClick, 
  index 
}) => {
  return (
    <div className="relative">
      {/* Cloud shape background with custom path */}
      <div className="absolute inset-0 transform scale-105">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <path 
            d="M40,80 C20,80 10,60 30,50 C25,30 45,20 60,35 C70,25 90,25 100,35 C110,20 130,25 140,35 C160,20 180,40 170,60 C185,70 175,90 155,85 C160,100 140,105 120,95 C100,105 80,100 70,90 C50,95 35,90 40,80 Z" 
            fill="url(#cloudGradient)" 
            className="drop-shadow-lg"
          />
          <defs>
            <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          delay: index * 0.15, 
          duration: 0.4,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(role)}
        className={`
          relative p-4 cursor-pointer will-change-transform
          ${isSelected 
            ? 'scale-105 z-20' 
            : 'z-10'
          }
        `}
        style={{ 
          minHeight: '320px'
        }}
      >
        <div className="relative z-10 text-center flex flex-col items-center justify-center h-full">
          {/* Lottie Animation */}
          <div className="mb-4 flex justify-center">
            <dotlottie-wc 
              src={lottieUrl} 
              style={{width: '160px', height: '160px'}} 
              autoplay 
              loop
            />
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-education-dark">
            {title}
          </h3>
        </div>
      </motion.div>
    </div>
  )
}

export default RoleCard
