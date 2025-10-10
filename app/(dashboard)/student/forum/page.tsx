'use client';

import { useState } from 'react';
import ForumBreadcrumb from '@/components/forum/ForumBreadcrumb';
import CreatePostCard from '@/components/forum/CreatePostCard';
import ForumFilter, { SortOption } from '@/components/forum/ForumFilter';
import ForumPost, { ForumPostData } from '@/components/forum/ForumPost';
import ForumStats, { ForumStatsData } from '@/components/forum/ForumStats';
import TagsWidget, { TagData } from '@/components/forum/TagsWidget';
import CommunityWidget, { CommunityMember } from '@/components/forum/CommunityWidget';
import PostDetailModal from '@/components/forum/PostDetailModal';

export default function StudentForumPage() {
  const [sortBy, setSortBy] = useState<SortOption>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPostData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);

  // Mock data - sẽ thay thế bằng API calls sau
  const [posts, setPosts] = useState<ForumPostData[]>([
    {
      id: '0',
      title: '📢 Hướng dẫn best practices khi làm việc với Database',
      content: 'Chào các em! Thầy muốn chia sẻ một số best practices quan trọng khi làm việc với database: 1) Luôn sử dụng prepared statements để tránh SQL injection, 2) Index các columns thường xuyên query, 3) Normalize database đúng cách...',
      author: {
        name: 'TS. Nguyễn Văn A',
        role: 'Giảng viên',
      },
      category: 'announcement',
      tags: ['Database', 'Best Practices', 'SQL'],
      votes: 156,
      comments: 23,
      views: 456,
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      hasFiles: true,
    },
    {
      id: '1',
      title: 'Làm thế nào để kết nối Python với cơ sở dữ liệu MySQL?',
      content: 'Em đang làm đồ án môn học và cần kết nối Python với MySQL. Em đã thử dùng mysql-connector-python nhưng vẫn bị lỗi. Các bạn có thể giúp em được không?',
      author: {
        name: 'Phan Điền Mạnh Thiên',
        role: 'Sinh Viên',
      },
      category: 'question',
      tags: ['Python', 'Database', 'MySQL'],
      votes: 100,
      comments: 15,
      views: 234,
      createdAt: new Date(Date.now() - 37 * 60 * 1000).toISOString(),
      hasFiles: false,
    },
    {
      id: '2',
      title: 'Tài liệu học React JS cho người mới bắt đầu',
      content: 'Mình vừa mới bắt đầu học React JS. Các bạn có thể gợi ý cho mình một số tài liệu hay roadmap để học hiệu quả không?',
      author: {
        name: 'Nguyễn Văn An',
        role: 'Sinh Viên',
      },
      category: 'share',
      tags: ['JavaScript', 'React', 'Web Development'],
      votes: 45,
      comments: 8,
      views: 156,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      hasFiles: true,
    },
    {
      id: '3',
      title: 'Giải thích thuật toán sắp xếp Quick Sort',
      content: 'Mình đang học về thuật toán sắp xếp. Có ai có thể giải thích chi tiết về Quick Sort và cho ví dụ code Python không ạ?',
      author: {
        name: 'Trần Thị Bình',
        role: 'Sinh Viên',
      },
      category: 'discussion',
      tags: ['Thuật toán', 'Python', 'Data Structures'],
      votes: 78,
      comments: 12,
      views: 189,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      hasFiles: false,
    },
    {
      id: '4',
      title: 'Cách tạo API RESTful với Node.js và Express',
      content: 'Em đang tìm hiểu về việc xây dựng RESTful API. Các anh chị có thể hướng dẫn em cách setup một project Node.js với Express không ạ?',
      author: {
        name: 'Lê Minh Châu',
        role: 'Sinh Viên',
      },
      category: 'question',
      tags: ['Node.js', 'Backend', 'API'],
      votes: 92,
      comments: 20,
      views: 345,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      hasFiles: true,
    },
  ]);

  const stats: ForumStatsData = {
    onlineUsers: 45,
    totalPosts: 1234,
    totalMembers: 567,
    todayPosts: 23,
  };

  const tags: TagData[] = [
    { name: 'Python', count: 156, color: 'bg-blue-100 text-blue-700' },
    { name: 'JavaScript', count: 143, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Java', count: 98, color: 'bg-red-100 text-red-700' },
    { name: 'Web Development', count: 187, color: 'bg-purple-100 text-purple-700' },
    { name: 'Database', count: 76, color: 'bg-pink-100 text-pink-700' },
    { name: 'AI/ML', count: 54, color: 'bg-indigo-100 text-indigo-700' },
    { name: 'Thuật toán', count: 89, color: 'bg-orange-100 text-orange-700' },
    { name: 'Backend', count: 65, color: 'bg-green-100 text-green-700' },
    { name: 'Frontend', count: 72, color: 'bg-cyan-100 text-cyan-700' },
    { name: 'Mobile Development', count: 48, color: 'bg-rose-100 text-rose-700' },
  ];

  const topMembers: CommunityMember[] = [
    { id: '1', name: 'TS. Nguyễn Văn A', role: 'Giảng viên', posts: 145, reputation: 2890, helpfulAnswers: 89 },
    { id: '2', name: 'Phan Điền Mạnh Thiên', role: 'Sinh viên', posts: 98, reputation: 1567, helpfulAnswers: 56 },
    { id: '3', name: 'Trần Thị B', role: 'Sinh viên', posts: 87, reputation: 1234, helpfulAnswers: 42 },
    { id: '4', name: 'Lê Văn C', role: 'Sinh viên', posts: 76, reputation: 987, helpfulAnswers: 38 },
    { id: '5', name: 'Phạm Thị D', role: 'Sinh viên', posts: 65, reputation: 876, helpfulAnswers: 31 },
  ];

  const handleCreatePost = (post: { title: string; content: string; category: string; topics: string[]; files: File[] }) => {
    const newPost: ForumPostData = {
      id: Date.now().toString(),
      title: post.title,
      content: post.content,
      author: {
        name: 'Phan Điền Mạnh Thiên',
        role: 'Sinh Viên',
      },
      category: post.category,
      tags: post.topics,
      votes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      hasFiles: post.files.length > 0,
    };
    setPosts([newPost, ...posts]);
  };

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          votes: voteType === 'up' ? post.votes + 1 : post.votes - 1,
        };
      }
      return post;
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log('Searching for:', query);
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    // Implement tag filter logic here
    console.log('Filter by tag:', tag);
  };

  // Filter posts based on search query, filterCategories, and filterTags
  const filteredPosts = posts.filter(post => {
    // Filter by selected categories in ForumFilter
    if (filterCategories.length > 0 && !filterCategories.includes(post.category)) {
      return false;
    }

    // Filter by selected tags in ForumFilter
    if (filterTags.length > 0) {
      const hasMatchingTag = post.tags.some(tag => filterTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    // Filter by search query
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <ForumBreadcrumb
        items={[
          { label: 'Diễn đàn', href: '/student/forum' },
          { label: 'Trao đổi 450i Diện Dân' },
        ]}
      />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Diễn Đàn Trao Đổi</h1>
        <p className="text-gray-600 mb-4">
          Nơi sinh viên và giảng viên cùng chia sẻ kiến thức, giải đáp thắc mắc và thảo luận học tập
        </p>
        
        {/* Enhanced Search Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm bài viết, chủ đề, hoặc người dùng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-3.5 text-base border border-blue-200 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all bg-white shadow-sm"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors text-sm"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <CreatePostCard onCreatePost={handleCreatePost} />

          {/* Filter */}
          <ForumFilter
            activeSort={sortBy}
            onSortChange={setSortBy}
            selectedCategories={filterCategories}
            onCategoriesChange={setFilterCategories}
            selectedTags={filterTags}
            onTagsChange={setFilterTags}
          />

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPost(post);
                    setIsModalOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <ForumPost post={post} onVote={handleVote} />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
                <p className="text-gray-400 text-sm mt-2">Thử tìm kiếm với từ khóa khác</p>
              </div>
            )}
          </div>

          {/* Load More */}
          <div className="text-center py-6">
            <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
              Xem thêm bài viết
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <TagsWidget tags={tags} onTagClick={handleTagClick} />

          {/* Community */}
          <CommunityWidget topMembers={topMembers} />

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Liên Kết Nhanh
            </h3>
            <div className="space-y-2">
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                📚 Tài liệu học tập
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                ❓ Câu hỏi thường gặp
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                📖 Hướng dẫn sử dụng
              </a>
              <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                ⚙️ Quy tắc diễn đàn
              </a>
            </div>
          </div>

          {/* Stats - Moved to bottom */}
          <ForumStats stats={stats} />
        </div>
      </div>

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPost(null);
        }}
      />
    </div>
  );
}

