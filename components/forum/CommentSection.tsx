'use client';

import { useState } from 'react';

export interface CommentData {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  votes: number;
  replies?: CommentData[];
  isBestAnswer?: boolean;
}

interface CommentSectionProps {
  comments: CommentData[];
  onAddComment: (content: string, parentId?: string) => void;
  onVoteComment: (commentId: string, voteType: 'up' | 'down') => void;
  onMarkBestAnswer?: (commentId: string) => void;
  canMarkBestAnswer?: boolean;
}

export default function CommentSection({ comments, onAddComment, onVoteComment, onMarkBestAnswer, canMarkBestAnswer = false }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyTo(null);
    }
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

  const CommentItem = ({ comment, isReply = false }: { comment: CommentData; isReply?: boolean }) => {
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    const handleVote = (type: 'up' | 'down') => {
      if (userVote === type) {
        setUserVote(null);
      } else {
        setUserVote(type);
        onVoteComment(comment.id, type);
      }
    };

    return (
      <div className={`${isReply ? 'ml-12 mt-4' : 'mt-4'}`}>
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {comment.author.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className={`${comment.isBestAnswer ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-100'} rounded-lg p-4 relative`}>
              {comment.isBestAnswer && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Đúng nhất
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-gray-900">{comment.author.name}</span>
                <span className="text-xs text-gray-500">{comment.author.role}</span>
                <span className="text-gray-400">•</span>
                <span className="text-xs text-gray-500">{getTimeAgo(comment.createdAt)}</span>
              </div>
              <p className={`${comment.isBestAnswer ? 'text-gray-800' : 'text-gray-700'}`}>{comment.content}</p>
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center">
                <button
                  onClick={() => handleVote('up')}
                  className={`p-1 rounded ${
                    userVote === 'up' ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:text-green-600 hover:bg-green-50'
                  } transition-colors`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <span className="mx-2 font-medium text-center min-w-[24px]">{comment.votes}</span>
                <button
                  onClick={() => handleVote('down')}
                  className={`p-1 rounded ${
                    userVote === 'down' ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
                  } transition-colors`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {!isReply && (
                <button
                  onClick={() => setReplyTo(comment.id)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Trả lời
                </button>
              )}

              {!isReply && canMarkBestAnswer && !comment.isBestAnswer && onMarkBestAnswer && (
                <button
                  onClick={() => onMarkBestAnswer(comment.id)}
                  className="text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Chọn làm đáp án đúng
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyTo === comment.id && (
              <div className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết câu trả lời..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSubmitReply(comment.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Gửi
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        {comments.length} Bình luận
      </h3>

      {/* Add Comment Form */}
      <div className="mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Chia sẻ suy nghĩ của bạn..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none"
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bình luận
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-gray-500">Chưa có bình luận nào</p>
          <p className="text-gray-400 text-sm mt-1">Hãy là người đầu tiên bình luận!</p>
        </div>
      )}
    </div>
  );
}
