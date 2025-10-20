'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function HomePage() {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('VN')


  const languages = [
    { 
      code: 'US', 
      name: 'English', 
      flag: 'https://flagcdn.com/w20/us.png',
      flagAlt: 'United States flag'
    },
    { 
      code: 'VN', 
      name: 'Tiếng Việt', 
      flag: 'https://flagcdn.com/w20/vn.png',
      flagAlt: 'Vietnam flag'
    }
  ]

  const stats = [
    { number: '5,000+', label: 'Sinh viên', icon: '🎓' },
    { number: '200+', label: 'Giảng viên', icon: '👨‍🏫' },
    { number: '50+', label: 'Đội ngũ hỗ trợ', icon: '💼' },
    { number: '4.9/5', label: 'Đánh giá', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-green-100">
      {/* Header */}
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md bg-white/60 border border-white/30 rounded-b-2xl mt-0" style={{ width: 'calc(100% - 200px)', maxWidth: '1200px' }}>
        <div className="flex items-center h-14 px-10">
          {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            className="flex items-center flex-shrink-0"
          >
            <img 
              src="/logo-slearn.png" 
              alt="Logo" 
              className="h-8 w-auto drop-shadow-lg filter" 
              style={{
                filter: 'drop-shadow(0 4px 8px rgba(20, 184, 166, 0.3)) drop-shadow(0 2px 4px rgba(59, 130, 246, 0.2))'
              }}
            />
          </motion.div>
          
          {/* Navigation Menu - Centered */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="hidden md:flex items-center space-x-8 mx-auto"
          >
            <Link href="/" className="text-gray-700 hover:text-teal-600 font-medium text-base transition-colors">
              Trang Chủ
            </Link>
            <Link href="/forum" className="text-gray-700 hover:text-teal-600 font-medium text-base transition-colors">
              Diễn Đàn
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-teal-600 font-medium text-base transition-colors">
              Dịch Vụ
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-teal-600 font-medium text-base transition-colors">
              Về Chúng Tôi
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-teal-600 font-medium text-base transition-colors">
              Hỗ Trợ
            </Link>
          </motion.nav>
          
          {/* Right Side - Language Dropdown & Login */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Language Dropdown */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/80 border border-white/50 hover:bg-white/90 transition-all text-sm"
              >
                <img 
                  src={languages.find(lang => lang.code === selectedLang)?.flag} 
                  alt={languages.find(lang => lang.code === selectedLang)?.flagAlt}
                  className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                />
                <span className="text-gray-700 font-medium">{selectedLang}</span>
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-48 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="px-3 py-2 bg-gray-50/80 border-b border-gray-200/30">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ngôn ngữ</p>
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang.code)
                          setIsLangDropdownOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-teal-50/80 transition-all duration-200 ${
                          selectedLang === lang.code ? 'bg-teal-50/80 text-teal-700' : 'text-gray-700'
                        }`}
                      >
                        <img 
                          src={lang.flag} 
                          alt={lang.flagAlt}
                          className="w-5 h-4 object-cover rounded-sm flex-shrink-0"
                        />
                        <span className="font-medium text-sm">{lang.name}</span>
                        {selectedLang === lang.code && (
                          <svg className="w-4 h-4 ml-auto text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Login Button */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link href="/login">
                <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:scale-105 transition-all">
                  Đăng nhập
                </button>
              </Link>
            </motion.div>
          </div>
          
          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden ml-4 p-2 text-gray-700 hover:text-teal-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Section 1: Hero */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-2"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-green-600 bg-clip-text text-transparent leading-tight">
                    Học Tập Thông Minh
                  </div>
                  <div className="text-gray-700 leading-tight">Cùng AI</div>
                </div>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Nền tảng giáo dục hiện đại tích hợp trí tuệ nhân tạo, mang đến trải nghiệm học tập cá nhân hóa và hiệu quả vượt trội
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/login">
                    <button className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                      Học tập ngay →
                    </button>
                  </Link>
                  <button className="px-8 py-4 rounded-full border-2 border-teal-500 text-teal-600 font-semibold text-lg hover:bg-teal-50 transition-all">
                    Khám phá
                  </button>
                </div>
              </motion.div>

              {/* Lottie Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative w-full max-w-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                  <div className="relative rounded-full overflow-hidden" style={{ 
                    maskImage: 'radial-gradient(circle, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)'
                  }}>
                    <dotlottie-wc 
                      src="https://lottie.host/ec2bd7a8-132c-4095-88fc-5cd98b2586e4/Rk9JXC6koO.lottie" 
                      style={{ width: '100%', height: '500px' }}
                      autoplay 
                      loop
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: AI Features */}
        <section className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 to-teal-100 overflow-hidden">
          {/* Container chính */}
          <div className="relative flex items-center justify-center w-full">
            {/* Grid layout cho 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl w-full">
              {[
                {
                  lottieUrl: 'https://lottie.host/f21e8bb6-71be-428e-be13-3cac9ed52c6b/TmUjhl8yIf.lottie',
                  title: 'Gia Sư AI Thông Minh',
                  subtitle: 'Hỗ trợ giải đáp thắc mắc 24/7 với độ chính xác cao',
                  position: 'top-left'
                },
                {
                  lottieUrl: 'https://lottie.host/ad1c4d9f-931f-49aa-805d-40b12a4db192/lWDKnesU21.lottie',
                  title: 'Tự Động Tạo Bài Tập',
                  subtitle: 'AI tạo bài tập phù hợp với trình độ từng học viên',
                  position: 'top-right'
                },
                {
                  lottieUrl: 'https://lottie.host/b49567e7-e96a-46f7-9ab7-0110931c2c8a/lLPHcmCkf8.lottie',
                  title: 'Phân Tích Tiến Độ',
                  subtitle: 'Theo dõi và đánh giá kết quả học tập chi tiết',
                  position: 'bottom-left'
                },
                {
                  lottieUrl: 'https://lottie.host/2b0f3e6b-43a9-4a9b-a6c8-7bbb4afa1461/QaIowWElvy.lottie',
                  title: 'Gợi Ý Cá Nhân Hóa',
                  subtitle: 'Đề xuất nội dung học phù hợp với mục tiêu riêng',
                  position: 'bottom-right'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ 
                    opacity: 0,
                    x: feature.position.includes('left') ? -50 : 50
                  }}
                  whileInView={{ 
                    opacity: 1,
                    x: 0
                  }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  className={`p-8 md:p-10 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/50 transition-all duration-300 cursor-pointer min-h-[280px] md:min-h-[280px] w-full max-w-lg md:max-w-xl group ${
                    feature.position.includes('left') 
                      ? 'flex flex-col md:flex-row items-center' 
                      : 'flex flex-col md:flex-row-reverse items-center'
                  }`}
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 25px 50px rgba(20, 184, 166, 0.15), 0 15px 35px rgba(59, 130, 246, 0.1), 0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {/* Lottie Icon */}
                  <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                    <DotLottieReact
                      src={feature.lottieUrl}
                      loop
                      autoplay
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        maxWidth: '160px',
                        maxHeight: '160px'
                      }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 flex flex-col justify-center text-center ${
                    feature.position.includes('left') 
                      ? 'mt-4 md:mt-0 md:ml-8 md:text-left' 
                      : 'mt-4 md:mt-0 md:mr-8 md:text-right'
                  }`}>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-base">{feature.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Vòng tròn trung tâm */}
            <motion.div
              initial={{ 
                opacity: 0, 
                scale: 0,
                rotate: -180
              }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                rotate: 0
              }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="absolute z-10 hidden md:flex items-center justify-center cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
              style={{
                top: '50%',
                left: '50%',
                width: '280px',
                height: '280px',
                marginTop: '-140px',
                marginLeft: '-140px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6, #3b82f6)',
                border: '8px solid rgba(255, 255, 255, 0.9)',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 30px 60px rgba(20, 184, 166, 0.3), 0 15px 35px rgba(59, 130, 246, 0.2), 0 0 0 25px rgba(255, 255, 255, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 20px rgba(255, 255, 255, 0.1)'
              }}
            >
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🧠</div>
                <div className="text-lg font-bold">AI</div>
                <div className="text-sm">Core</div>
              </div>
            </motion.div>
          </div>


          <style jsx>{`
            @media (max-width: 768px) {
              .grid {
                grid-template-columns: 1fr;
                gap: 1rem;
              }
            }
          `}</style>
        </section>

        {/* Section 3: Stats */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-100 to-blue-100">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Được Tin Dùng Bởi
                </span>
              </h2>
              <p className="text-xl text-gray-600">
                Hàng ngàn người dùng đã tin chọn Smart Learning
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-2xl transition-all hover:scale-105"
                >
                  <div className="text-6xl mb-4">{stat.icon}</div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-20 max-w-4xl mx-auto"
            >
              <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-3xl p-1">
                <div className="bg-white rounded-3xl p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 flex items-center justify-center text-4xl">
                        👤
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="text-yellow-500 text-3xl mb-3">⭐⭐⭐⭐⭐</div>
                      <p className="text-gray-700 text-lg italic mb-4">
                        "Smart Learning đã thay đổi hoàn toàn cách tôi học tập. Giao diện thân thiện, công nghệ AI hỗ trợ tuyệt vời!"
                      </p>
                      <div className="font-semibold text-gray-800">Nguyễn Văn A</div>
                      <div className="text-gray-500">Sinh viên năm 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo-slearn.png" alt="Logo" className="h-10 w-auto" />
                <span className="text-xl font-bold">TKM</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Nền tảng học tập thông minh tích hợp AI, mang đến trải nghiệm giáo dục hiện đại và hiệu quả.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Liên Kết</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Khóa học</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Chính Sách</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Điều khoản sử dụng</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Chính sách bảo mật</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Hướng dẫn</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 by Smart Learning TKM with ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
