'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Kết nối BE sau
    console.log('Admin login:', formData);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-between">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Manage_BG.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Logo Section - Left */}
      <div className="relative z-10 flex-1 flex items-center justify-center pl-8 lg:pl-16">
        <div className="text-center">
          <Image
            src="/SManage_logo.png"
            alt="SManage Logo"
            width={400}
            height={200}
            className="mx-auto drop-shadow-2xl"
            priority
          />
          <h1 className="text-white text-3xl lg:text-4xl font-bold mt-6 drop-shadow-lg">
            Hệ thống quản trị
          </h1>
          <p className="text-white/90 text-lg mt-2 drop-shadow-md">
            Smart Learning Management
          </p>
        </div>
      </div>

      {/* Login Form Section - Right */}
      <div className="relative z-10 flex-1 flex items-center justify-center pr-8 lg:pr-16">
        <div className="bg-gradient-to-br from-blue-50/90 to-green-50/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-300 transition duration-200 font-medium"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
