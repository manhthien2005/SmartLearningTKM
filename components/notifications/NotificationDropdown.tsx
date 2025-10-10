'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckIcon, BellIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface NotificationData {
  notification_id: number;
  type: string;
  title: string;
  content: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  actor?: {
    user_id: number;
    full_name: string;
    avatar_url?: string;
  };
}

interface NotificationDropdownProps {
  onClose: () => void;
  onNotificationRead: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationDropdown({
  onClose,
  onNotificationRead,
  onMarkAllRead,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Mock notifications data (replace with real API later)
  const fetchNotifications = async () => {
    try {
      // Mock data - replace with real API call later
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const mockNotifications: NotificationData[] = [
        {
          notification_id: 1,
          type: 'forum_reply',
          title: 'Trả lời bài viết',
          content: 'Trần Văn B đã trả lời bài viết của bạn: "Làm thế nào để kết nối Python..."',
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          actor: {
            user_id: 2,
            full_name: 'Trần Văn B',
          }
        },
        {
          notification_id: 2,
          type: 'assignment_graded',
          title: 'Bài tập đã được chấm',
          content: 'Bài tập "Assignment 2" của bạn đã được [Giảng viên] Nguyễn Thị C chấm điểm.',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          actor: {
            user_id: 3,
            full_name: 'Nguyễn Thị C',
          }
        },
        {
          notification_id: 3,
          type: 'mention',
          title: 'Được nhắc đến',
          content: 'Lê Văn D đã nhắc đến bạn trong một bình luận.',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          actor: {
            user_id: 4,
            full_name: 'Lê Văn D',
          }
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Vừa xong';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} phút trước`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} giờ trước`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification: NotificationData) => {
    // Mock mark as read (replace with real API later)
    if (!notification.is_read) {
      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.notification_id === notification.notification_id
            ? { ...n, is_read: true }
            : n
        )
      );
      onNotificationRead();
    }

    // Navigate based on notification type
    let targetUrl = '';
    const data = notification.data;

    switch (notification.type) {
      case 'forum_reply':
        if (data?.post_id) {
          targetUrl = `/student/forum?post=${data.post_id}`;
        } else {
          targetUrl = '/student/forum';
        }
        break;
      case 'assignment_graded':
        if (data?.assignment_id) {
          targetUrl = `/student/assignments/${data.assignment_id}`;
        } else {
          targetUrl = '/student/assignments';
        }
        break;
      case 'mention':
        if (data?.post_id) {
          targetUrl = `/student/forum?post=${data.post_id}`;
        } else if (data?.url) {
          targetUrl = data.url;
        } else {
          targetUrl = '/student/forum';
        }
        break;
      default:
        targetUrl = '/student';
    }

    onClose();
    router.push(targetUrl);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    // Mock mark all as read (replace with real API later)
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
    onMarkAllRead();
  };

  // Get avatar for notification
  const getNotificationAvatar = (notification: NotificationData) => {
    if (notification.actor?.avatar_url) {
      return (
        <Image
          src={notification.actor.avatar_url}
          alt={notification.actor.full_name}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      );
    } else if (notification.actor?.full_name) {
      const initials = notification.actor.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-xs">{initials}</span>
        </div>
      );
    } else {
      // System notification
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-xs">S</span>
        </div>
      );
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.is_read) && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                title="Đánh dấu tất cả đã đọc"
              >
                <CheckIcon className="w-4 h-4" />
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BellIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                onClick={() => handleNotificationClick(notification)}
                className={`flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {getNotificationAvatar(notification)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                    
                    {/* Unread indicator */}
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <Link
          href="/student/notifications"
          onClick={onClose}
          className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Xem tất cả thông báo
        </Link>
      </div>
    </div>
  );
}
