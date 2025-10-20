'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ProfileDropdownProps {
  role: 'student' | 'teacher';
  className?: string;
}

export default function ProfileDropdown({ role, className = '' }: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        toast.success('Đăng xuất thành công!', {
          position: 'bottom-right',
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
            fontWeight: '500',
          },
        });
        
        router.push('/login');
        setShowLogoutModal(false);
        setIsOpen(false);
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      toast.error('Lỗi khi đăng xuất', {
        position: 'bottom-right',
        duration: 3000,
      });
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push(`/${role}/profile`);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    router.push(`/${role}/settings`);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Profile Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-sm">T</span>
        </div>
        
        {/* Name & Role */}
        <div className="hidden md:block text-left">
          <p className="font-medium text-gray-900 text-sm">Mr. Thiên</p>
          <p className="text-xs text-gray-500 capitalize">
            {role === 'student' ? 'Sinh Viên' : 'Giảng Viên'}
          </p>
        </div>
        
        {/* Chevron */}
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1"
        >
          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <UserCircleIcon className="w-5 h-5 text-gray-500" />
              <span>Hồ sơ cá nhân</span>
            </button>
            
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
              <span>Cài đặt</span>
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-1"></div>

          {/* Logout */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowLogoutModal(true);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xác Nhận Đăng Xuất</h3>
                <p className="text-sm text-gray-500">Bạn có chắc chắn muốn đăng xuất không?</p>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
