'use client';

import { useState, useRef } from 'react';

interface CreatePostCardProps {
  onCreatePost: (post: { title: string; content: string; category: string; topics: string[]; files: File[] }) => void;
}

// Định nghĩa rõ ràng các loại bài viết
const POST_CATEGORIES = [
  { value: 'question', label: '❓ Hỏi đáp', color: 'bg-green-100 text-green-700' },
  { value: 'discussion', label: '💬 Thảo luận', color: 'bg-blue-100 text-blue-700' },
  { value: 'share', label: '📚 Chia sẻ', color: 'bg-purple-100 text-purple-700' },
  { value: 'announcement', label: '📢 Thông báo', color: 'bg-orange-100 text-orange-700' },
];

// Chủ đề học tập - có thể mở rộng không giới hạn
const AVAILABLE_TOPICS = [
  'Python', 'Java', 'JavaScript', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'Web Development', 'Mobile Development', 'Backend', 'Frontend', 'Full Stack',
  'Database', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL',
  'AI/ML', 'Machine Learning', 'Deep Learning', 'Data Science', 'Big Data',
  'Cloud Computing', 'AWS', 'Azure', 'DevOps', 'Docker', 'Kubernetes',
  'Thuật toán', 'Cấu trúc dữ liệu', 'OOP', 'Design Pattern',
  'Git', 'Linux', 'Networking', 'Security', 'API', 'REST', 'GraphQL',
];

export default function CreatePostCard({ onCreatePost }: CreatePostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('question');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  
  // Autocomplete state
  const [topicInput, setTopicInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredTopics, setFilteredTopics] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (title.trim() && content.trim() && selectedCategory) {
      onCreatePost({ 
        title, 
        content, 
        category: selectedCategory,
        topics: selectedTopics, 
        files 
      });
      // Reset form
      setTitle('');
      setContent('');
      setSelectedCategory('question');
      setSelectedTopics([]);
      setFiles([]);
      setTopicInput('');
      setIsExpanded(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const addTopic = (topic: string) => {
    if (!selectedTopics.includes(topic) && selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topic]);
      setTopicInput('');
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter(t => t !== topic));
  };

  const handleTopicInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && topicInput.trim() && selectedTopics.length < 5) {
      e.preventDefault();
      // Nếu có gợi ý, thêm gợi ý đầu tiên
      if (filteredTopics.length > 0) {
        addTopic(filteredTopics[0]);
      } 
      // Nếu không có gợi ý, cho phép tạo topic mới
      else if (!AVAILABLE_TOPICS.includes(topicInput.trim())) {
        addTopic(topicInput.trim());
      }
    } else if (e.key === 'Backspace' && !topicInput && selectedTopics.length > 0) {
      // Xóa topic cuối cùng khi nhấn backspace và input rỗng
      setSelectedTopics(selectedTopics.slice(0, -1));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className={`flex gap-4 ${isExpanded ? 'items-start' : 'items-center'}`}>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
          SV
        </div>
        
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className="flex-1 text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-gray-500 transition-colors"
          >
            Tạo bài viết tại đây...
          </button>
        ) : (
          <div className="flex-1 space-y-4">
            <input
              type="text"
              placeholder="Tiêu đề bài viết"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none"
            />
            
            <textarea
              placeholder="Nội dung bài viết của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-400 focus:border-blue-400 outline-none resize-none"
            />

            {/* Category Selection - Loại bài viết */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Loại bài viết: <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {POST_CATEGORIES.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category.value
                        ? `${category.color} ring-2 ring-offset-2 ring-blue-500`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics Selection - Chủ đề (Tag Filter inside input) */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Chủ đề liên quan (Tối đa 5):
              </label>
              
              {/* Tag Input with Chips Inside */}
              <div className="relative">
                <div 
                  className="w-full min-h-[42px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-400 bg-white cursor-text flex flex-wrap gap-1.5 items-center"
                  onClick={() => {
                    inputRef.current?.focus();
                    if (!showSuggestions) {
                      // Show all available topics when clicking
                      const availableTopics = AVAILABLE_TOPICS.filter(t => !selectedTopics.includes(t));
                      setFilteredTopics(availableTopics);
                      setShowSuggestions(true);
                    }
                  }}
                >
                  {/* Selected Topics as Chips */}
                  {selectedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium"
                    >
                      #{topic}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTopic(topic);
                        }}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                  
                  {/* Input */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={topicInput}
                    onChange={(e) => {
                      setTopicInput(e.target.value);
                      if (e.target.value.trim()) {
                        const filtered = AVAILABLE_TOPICS.filter(topic =>
                          topic.toLowerCase().includes(e.target.value.toLowerCase()) &&
                          !selectedTopics.includes(topic)
                        );
                        setFilteredTopics(filtered);
                        setShowSuggestions(filtered.length > 0);
                      } else {
                        const availableTopics = AVAILABLE_TOPICS.filter(t => !selectedTopics.includes(t));
                        setFilteredTopics(availableTopics);
                        setShowSuggestions(true);
                      }
                    }}
                    onKeyDown={handleTopicInputKeyDown}
                    onFocus={() => {
                      if (selectedTopics.length < 5) {
                        const availableTopics = AVAILABLE_TOPICS.filter(t => !selectedTopics.includes(t));
                        setFilteredTopics(availableTopics);
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => setShowSuggestions(false)}
                    disabled={selectedTopics.length >= 5}
                    placeholder={selectedTopics.length === 0 ? (selectedTopics.length >= 5 ? "Đã đạt giới hạn 5 chủ đề" : "Tìm kiếm chủ đề... (Python, Java, React...)") : ""}
                    className="flex-1 min-w-[120px] outline-none bg-transparent disabled:cursor-not-allowed"
                  />
                  
                  <svg 
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Suggestions Dropdown */}
                {showSuggestions && filteredTopics.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-md max-h-48 overflow-y-auto">
                    {filteredTopics.slice(0, 15).map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addTopic(topic);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
                      >
                        <span className="text-gray-600">#</span>
                        <span>{topic}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>Đính kèm file hoặc hình ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {files.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {files.length} file đã chọn: {files.map(f => f.name).join(', ')}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setContent('');
                  setSelectedCategory('question');
                  setSelectedTopics([]);
                  setFiles([]);
                  setTopicInput('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!title.trim() || !content.trim() || !selectedCategory}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Đăng bài
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
