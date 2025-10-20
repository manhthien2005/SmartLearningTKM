'use client';

import { useState } from 'react';
import Link from 'next/link';

export interface ForumPostData {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  category: string; // Loại bài viết: question, discussion, share, announcement
  tags: string[]; // Chủ đề: Python, Java, etc.
  votes: number;
  comments: number;
  views: number;
  createdAt: string;
  hasFiles?: boolean;
}

interface ForumPostProps {
  post: ForumPostData;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
}

export default function ForumPost({ post, onVote }: ForumPostProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
      onVote(post.id, type);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'vừa xong';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const isTeacher = post.author.role.toLowerCase().includes('giảng viên') || post.author.role.toLowerCase().includes('giáo viên');

  return (
    <div className={`rounded-xl shadow-sm border hover:shadow-md transition-shadow relative ${
      isTeacher 
        ? 'bg-gradient-to-br from-amber-50/50 to-yellow-50/30 border-amber-200' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Bookmark Button */}
      <button
        onClick={handleBookmark}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 hover:bg-opacity-80 transition-colors z-10"
        title={isBookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
      >
        {isBookmarked ? (
          <svg className="w-5 h-5 text-yellow-500 fill-current" viewBox="0 0 20 20">
            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        )}
      </button>

      <div className="p-6">
        <div className="flex gap-4">
          {/* Vote Section */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleVote('up')}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                userVote === 'up' ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className={`font-bold text-lg ${
              userVote === 'up' ? 'text-green-600' : userVote === 'down' ? 'text-red-600' : 'text-gray-700'
            }`}>
              {post.votes}
            </span>
            <button
              onClick={() => handleVote('down')}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                userVote === 'down' ? 'text-red-600' : 'text-gray-400'
              }`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Author Info */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                isTeacher 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 ring-2 ring-amber-300' 
                  : 'bg-gradient-to-br from-blue-500 to-blue-600'
              }`}>
                {post.author.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{post.author.name}</span>
                  {isTeacher && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold border border-amber-300">
                      ⭐ Giảng viên
                    </span>
                  )}
                  {!isTeacher && (
                    <>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{post.author.role}</span>
                    </>
                  )}
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{getTimeAgo(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Post Title */}
            <Link href={`#`} className="group">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                {post.title}
                {isTeacher && (
                  <span className="text-amber-500 text-base" title="Bài viết từ Giảng viên">
                    ✨
                  </span>
                )}
              </h3>
            </Link>

            {/* Post Content Preview */}
            <p className="text-gray-600 mb-3 line-clamp-2">
              {post.content}
            </p>

            {/* Category & Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Category Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                post.category === 'question' ? 'bg-green-100 text-green-700 border-green-200' :
                post.category === 'discussion' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                post.category === 'share' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                'bg-orange-100 text-orange-700 border-orange-200'
              }`}>
                {post.category === 'question' ? '❓ Hỏi đáp' :
                 post.category === 'discussion' ? '💬 Thảo luận' :
                 post.category === 'share' ? '📚 Chia sẻ' :
                 '📢 Thông báo'}
              </span>

              {/* Topic Tags */}
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors cursor-pointer border border-gray-200 hover:border-gray-300"
                >
                  #{tag}
                </span>
              ))}

              {/* File Attachment Badge */}
              {post.hasFiles && (
                <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-medium flex items-center gap-1 border border-amber-200">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  File đính kèm
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{post.comments} bình luận</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views} lượt xem</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
