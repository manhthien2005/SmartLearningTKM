'use client';

import { useState, useEffect } from 'react';
import { 
  BellIcon, 
  UserCircleIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  CheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface NotificationSettings {
  web_forum_reply: boolean;
  web_mention: boolean;
  web_assignment_grade: boolean;
  web_system: boolean;
  email_important: boolean;
  email_weekly_summary: boolean;
}

export default function StudentSettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    web_forum_reply: true,
    web_mention: true,
    web_assignment_grade: true,
    web_system: true,
    email_important: true,
    email_weekly_summary: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Mock save notification settings
  const saveNotificationSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      setIsSaving(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setNotificationSettings(prev => ({ ...prev, ...newSettings }));
      toast.success('Cài đặt đã được lưu');
    } catch (error) {
      toast.error('Không thể lưu cài đặt');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationToggle = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...notificationSettings, [key]: value };
    setNotificationSettings(newSettings);
    saveNotificationSettings({ [key]: value });
  };

  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    disabled = false 
  }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const settingsSections = [
    {
      id: 'notifications',
      title: 'Thông báo',
      icon: BellIcon,
      description: 'Quản lý cách bạn nhận thông báo',
      color: 'blue'
    },
    {
      id: 'profile',
      title: 'Hồ sơ cá nhân',
      icon: UserCircleIcon,
      description: 'Cập nhật thông tin cá nhân',
      color: 'green'
    },
    {
      id: 'privacy',
      title: 'Quyền riêng tư & Bảo mật',
      icon: ShieldCheckIcon,
      description: 'Quản lý quyền riêng tư và bảo mật',
      color: 'purple'
    },
    {
      id: 'appearance',
      title: 'Giao diện',
      icon: PaintBrushIcon,
      description: 'Tùy chỉnh giao diện hệ thống',
      color: 'pink'
    },
    {
      id: 'language',
      title: 'Ngôn ngữ & Khu vực',
      icon: GlobeAltIcon,
      description: 'Thay đổi ngôn ngữ và múi giờ',
      color: 'indigo'
    },
    {
      id: 'devices',
      title: 'Thiết bị đáng tin cậy',
      icon: DevicePhoneMobileIcon,
      description: 'Quản lý các thiết bị đã đăng nhập',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      pink: 'bg-pink-100 text-pink-600',
      indigo: 'bg-indigo-100 text-indigo-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      {/* Web Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Thông báo trên web (In-app)
          </h3>
          <p className="text-sm text-gray-600 mt-1">Nhận thông báo trực tiếp trên website</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm">💬</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Trả lời bài viết</h4>
                <p className="text-sm text-gray-600">Khi ai đó trả lời bài viết của bạn</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.web_forum_reply}
              onChange={(checked) => handleNotificationToggle('web_forum_reply', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm">@</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Nhắc đến (@mention)</h4>
                <p className="text-sm text-gray-600">Khi ai đó nhắc đến bạn</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.web_mention}
              onChange={(checked) => handleNotificationToggle('web_mention', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm">📝</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Chấm điểm bài tập</h4>
                <p className="text-sm text-gray-600">Khi bài tập được chấm điểm</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.web_assignment_grade}
              onChange={(checked) => handleNotificationToggle('web_assignment_grade', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-sm">⚙️</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Thông báo hệ thống</h4>
                <p className="text-sm text-gray-600">Thông báo quan trọng từ hệ thống</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.web_system}
              onChange={(checked) => handleNotificationToggle('web_system', checked)}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Thông báo qua Email
          </h3>
          <p className="text-sm text-gray-600 mt-1">Gửi thông báo đến email của bạn</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm">📧</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Hoạt động quan trọng</h4>
                <p className="text-sm text-gray-600">Email cho hoạt động quan trọng</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email_important}
              onChange={(checked) => handleNotificationToggle('email_important', checked)}
              disabled={isSaving}
            />
          </div>

          <div className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-indigo-600 text-sm">📅</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Tổng hợp hàng tuần</h4>
                <p className="text-sm text-gray-600">Email tổng hợp vào Chủ nhật</p>
              </div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email_weekly_summary}
              onChange={(checked) => handleNotificationToggle('email_weekly_summary', checked)}
              disabled={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoonSection = (title: string) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🚧</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">Tính năng này đang được phát triển và sẽ có sớm!</p>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'notifications':
        return renderNotificationsSection();
      case 'profile':
        return renderComingSoonSection('Hồ sơ cá nhân');
      case 'privacy':
        return renderComingSoonSection('Quyền riêng tư & Bảo mật');
      case 'appearance':
        return renderComingSoonSection('Giao diện');
      case 'language':
        return renderComingSoonSection('Ngôn ngữ & Khu vực');
      case 'devices':
        return renderComingSoonSection('Thiết bị đáng tin cậy');
      default:
        return renderNotificationsSection();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
        <p className="text-gray-600">Quản lý tài khoản và tùy chỉnh trải nghiệm của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <nav className="space-y-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-blue-100' : getColorClasses(section.color)
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-gray-500 truncate">{section.description}</div>
                    </div>
                    {isActive && <ChevronRightIcon className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Status Card */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckIcon className="w-4 h-4 text-green-600" />
                <h3 className="font-medium text-gray-900 text-sm">Trạng thái</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Tự động lưu</span>
                  <span className="text-green-600 font-medium">Bật</span>
                </div>
                {isSaving && (
                  <div className="flex items-center gap-2 text-xs text-blue-600">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang lưu...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

