'use client';

import { useState, useEffect } from 'react';
import { BellIcon, CheckIcon, FunnelIcon } from '@heroicons/react/24/outline';
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

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'forum' | 'assignment'>('all');

  // Mock notifications data (replace with real API later)
  const fetchNotifications = async (page = 1, resetList = false) => {
    try {
      setIsLoading(true);
      
      // Mock data - replace with real API call later
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      const mockNotifications: NotificationData[] = [
        {
          notification_id: 1,
          type: 'forum_reply',
          title: 'Trả lời bài viết',
          content: 'Trần Văn B đã trả lời bài viết của bạn: "Làm thế nào để kết nối Python với MySQL?"',
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          actor: { user_id: 2, full_name: 'Trần Văn B' }
        },
        {
          notification_id: 2,
          type: 'assignment_graded',
          title: 'Bài tập đã được chấm',
          content: 'Bài tập "Assignment 2: Lập trình Web" của bạn đã được [Giảng viên] Nguyễn Thị C chấm điểm.',
          is_read: false,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          actor: { user_id: 3, full_name: 'Nguyễn Thị C' }
        },
        {
          notification_id: 3,
          type: 'mention',
          title: 'Được nhắc đến',
          content: 'Lê Văn D đã nhắc đến bạn trong bình luận về "Cách tối ưu hóa database".',
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          actor: { user_id: 4, full_name: 'Lê Văn D' }
        },
        {
          notification_id: 4,
          type: 'system',
          title: 'Thông báo hệ thống',
          content: 'Hệ thống sẽ bảo trì vào 23:00 - 01:00 ngày mai. Vui lòng lưu công việc.',
          is_read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          notification_id: 5,
          type: 'forum_reply',
          title: 'Trả lời bài viết',
          content: 'Phạm Văn E đã trả lời bài viết của bạn: "Hướng dẫn sử dụng React Hooks"',
          is_read: true,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          actor: { user_id: 5, full_name: 'Phạm Văn E' }
        }
      ];
      
      // Apply filters
      let filteredNotifications = mockNotifications;
      if (filter === 'unread') {
        filteredNotifications = mockNotifications.filter(n => !n.is_read);
      } else if (filter !== 'all') {
        filteredNotifications = mockNotifications.filter(n => n.type === filter);
      }
      
      if (resetList || page === 1) {
        setNotifications(filteredNotifications);
      } else {
        setNotifications(prev => [...prev, ...filteredNotifications]);
      }
      
      setPagination({
        page,
        limit: pagination.limit,
        total: filteredNotifications.length,
        totalPages: Math.ceil(filteredNotifications.length / pagination.limit),
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications(1, true);
  }, [filter]);

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
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  // Get notification type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return 'Diễn đàn';
      case 'assignment_graded':
        return 'Bài tập';
      case 'mention':
        return 'Nhắc đến';
      case 'system':
        return 'Hệ thống';
      default:
        return 'Khác';
    }
  };

  // Get notification type color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'forum_reply':
        return 'bg-blue-100 text-blue-800';
      case 'assignment_graded':
        return 'bg-green-100 text-green-800';
      case 'mention':
        return 'bg-purple-100 text-purple-800';
      case 'system':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get avatar for notification
  const getNotificationAvatar = (notification: NotificationData) => {
    if (notification.actor?.avatar_url) {
      return (
        <Image
          src={notification.actor.avatar_url}
          alt={notification.actor.full_name}
          width={40}
          height={40}
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
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">{initials}</span>
        </div>
      );
    } else {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">S</span>
        </div>
      );
    }
  };

  // Handle mark as read (mock)
  const handleMarkAsRead = async (notificationId: number) => {
    // Mock mark as read (replace with real API later)
    setNotifications(prev =>
      prev.map(n =>
        n.notification_id === notificationId
          ? { ...n, is_read: true }
          : n
      )
    );
  };

  // Handle mark all as read (mock)
  const handleMarkAllAsRead = async () => {
    // Mock mark all as read (replace with real API later)
    setNotifications(prev =>
      prev.map(n => ({ ...n, is_read: true }))
    );
  };

  // Load more notifications
  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchNotifications(pagination.page + 1, false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BellIcon className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
              <p className="text-gray-600">
                {pagination.total} thông báo • {unreadCount} chưa đọc
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-600 mr-2">Lọc:</span>
          
          {[
            { key: 'all', label: 'Tất cả' },
            { key: 'unread', label: 'Chưa đọc' },
            { key: 'forum_reply', label: 'Diễn đàn' },
            { key: 'assignment_graded', label: 'Bài tập' },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading && notifications.length === 0 ? (
          <div className="p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 p-4 animate-pulse border-b border-gray-100 last:border-b-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
            <p className="text-gray-600">
              {filter === 'unread' 
                ? 'Bạn đã đọc tất cả thông báo'
                : 'Chưa có thông báo nào được gửi đến bạn'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {getNotificationAvatar(notification)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {getTypeLabel(notification.type)}
                        </span>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <h3 className="font-medium text-gray-900 mb-1">
                        {notification.title}
                      </h3>
                      
                      <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                        {notification.content}
                      </p>
                      
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.notification_id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Đánh dấu đã đọc"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {pagination.page < pagination.totalPages && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Đang tải...' : 'Tải thêm'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
