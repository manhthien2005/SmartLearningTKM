'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HomePage() {
  const stats = [
    { number: '5,000+', label: 'Sinh viên', icon: '🎓' },
    { number: '200+', label: 'Giảng viên', icon: '👨‍🏫' },
    { number: '50+', label: 'Đội ngũ hỗ trợ', icon: '💼' },
    { number: '4.9/5', label: 'Đánh giá', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-md bg-white/60 border border-white/30 rounded-b-2xl mt-0">
        <div className="flex justify-between items-center h-14 px-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center"
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
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex"
          >
            <Link href="/login">
              <button className="px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium text-sm hover:shadow-lg hover:scale-105 transition-all">
                Đăng nhập
              </button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">
        {/* Section 1: Hero */}
        <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-teal-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                    Học Tập Thông Minh
                  </span>
                  <br />
                  <span className="text-gray-700">Cùng AI</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                  Nền tảng giáo dục hiện đại tích hợp trí tuệ nhân tạo, mang đến trải nghiệm học tập cá nhân hóa và hiệu quả vượt trội
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/login">
                    <button className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all">
                      Bắt đầu ngay →
                    </button>
                  </Link>
                  <button className="px-8 py-4 rounded-full border-2 border-teal-500 text-teal-600 font-semibold text-lg hover:bg-teal-50 transition-all">
                    Tìm hiểu thêm
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
                  <dotlottie-wc 
                    src="https://lottie.host/ec2bd7a8-132c-4095-88fc-5cd98b2586e4/Rk9JXC6koO.lottie" 
                    style={{ width: '100%', height: '500px' }}
                    autoplay 
                    loop
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 2: AI Features */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
          {/* Robot Lottie - Top Left */}
          <motion.div
            initial={{ opacity: 0, x: -100, y: -100 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-10 left-10 hidden lg:block"
          >
            <dotlottie-wc 
              src="https://lottie.host/f21e8bb6-71be-428e-be13-3cac9ed52c6b/TmUjhl8yIf.lottie" 
              style={{ width: '250px', height: '250px' }}
              autoplay 
              loop
            />
          </motion.div>

          {/* AI Interaction Lottie - Bottom Right */}
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-10 right-10 hidden lg:block"
          >
            <dotlottie-wc 
              src="https://lottie.host/5d3471f9-4789-4731-ba33-03708165e4e4/mtfbNAi1Bh.lottie" 
              style={{ width: '280px', height: '280px' }}
              autoplay 
              loop
            />
          </motion.div>

          {/* Center Content */}
          <div className="max-w-5xl mx-auto text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Trí Tuệ Nhân Tạo
                </span>
                <br />
                <span className="text-gray-700">Hỗ Trợ Học Tập</span>
              </h2>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Công nghệ AI tiên tiến giúp cá nhân hóa trải nghiệm học tập của bạn
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                {[
                  {
                    icon: '🤖',
                    title: 'Trợ Lý AI Thông Minh',
                    desc: 'Hỗ trợ giải đáp thắc mắc 24/7 với độ chính xác cao'
                  },
                  {
                    icon: '📚',
                    title: 'Tự Động Tạo Bài Tập',
                    desc: 'AI tạo bài tập phù hợp với trình độ từng học viên'
                  },
                  {
                    icon: '📊',
                    title: 'Phân Tích Tiến Độ',
                    desc: 'Theo dõi và đánh giá kết quả học tập chi tiết'
                  },
                  {
                    icon: '🎯',
                    title: 'Gợi Ý Cá Nhân Hóa',
                    desc: 'Đề xuất nội dung học phù hợp với mục tiêu riêng'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="text-5xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Stats */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
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
