'use client';

import { useState, useEffect } from 'react';
import { ForumPostData } from './ForumPost';
import CommentSection, { CommentData } from './CommentSection';

interface PostDetailModalProps {
  post: ForumPostData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [bestAnswerId, setBestAnswerId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && post) {
      // Load comments for the post
      // Mock data for now
      setComments([
        {
          id: '1',
          author: {
            name: 'Nguyễn Văn A',
            role: 'Giảng viên',
          },
          content: 'Bạn có thể sử dụng thư viện mysql-connector-python. Hãy đảm bảo bạn đã cài đặt nó bằng pip install mysql-connector-python.',
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          votes: 12,
          isBestAnswer: true,
          replies: [
            {
              id: '2',
              author: {
                name: 'Phan Điền Mạnh Thiên',
                role: 'Sinh viên',
              },
              content: 'Cảm ơn thầy! Em sẽ thử ngay.',
              createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
              votes: 3,
            },
          ],
        },
        {
          id: '3',
          author: {
            name: 'Trần Thị B',
            role: 'Sinh viên',
          },
          content: 'Mình cũng gặp vấn đề tương tự. Bạn có thể chia sẻ code error không?',
          createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          votes: 5,
        },
      ]);
    }
  }, [isOpen, post]);

  const handleAddComment = (content: string, parentId?: string) => {
    const newComment: CommentData = {
      id: Date.now().toString(),
      author: {
        name: 'Phan Điền Mạnh Thiên',
        role: 'Sinh viên',
      },
      content,
      createdAt: new Date().toISOString(),
      votes: 0,
    };

    if (parentId) {
      // Add as reply
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newComment],
          };
        }
        return comment;
      }));
    } else {
      // Add as new comment
      setComments([...comments, newComment]);
    }
  };

  const handleVoteComment = (commentId: string, voteType: 'up' | 'down') => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          votes: voteType === 'up' ? comment.votes + 1 : comment.votes - 1,
        };
      }
      // Check replies
      if (comment.replies) {
        return {
          ...comment,
          replies: comment.replies.map(reply => {
            if (reply.id === commentId) {
              return {
                ...reply,
                votes: voteType === 'up' ? reply.votes + 1 : reply.votes - 1,
              };
            }
            return reply;
          }),
        };
      }
      return comment;
    }));
  };

  const handleMarkBestAnswer = (commentId: string) => {
    setComments(comments.map(comment => ({
      ...comment,
      isBestAnswer: comment.id === commentId,
    })));
    setBestAnswerId(commentId);
  };

  // Check if current user is the post author (mock logic)
  const canMarkBestAnswer = post?.author.name === 'Phan Điền Mạnh Thiên';

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết bài viết</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Post Content */}
          <div className="p-6 border-b border-gray-200">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {post.author.name.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{post.author.name}</div>
              <div className="text-sm text-gray-500">{post.author.role}</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Attachments */}
          {post.hasFiles && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                File đính kèm
              </h3>
              <div className="space-y-2">
                <a href="#" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  example_code.py (2.4 KB)
                </a>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments} bình luận</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
            </div>
          </div>
          </div>

          {/* Comments */}
          <div className="p-6">
            <CommentSection
              comments={comments}
              onAddComment={handleAddComment}
              onVoteComment={handleVoteComment}
              onMarkBestAnswer={handleMarkBestAnswer}
              canMarkBestAnswer={canMarkBestAnswer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
