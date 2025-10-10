'use client';

import { useState } from 'react';

export type SortOption = 'hot' | 'new' | 'top' | 'unanswered';

interface ForumFilterProps {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  selectedTags?: string[];
  onTagsChange?: (tags: string[]) => void;
}

const CATEGORIES = [
  { value: 'all', label: 'Tất cả', icon: '📋' },
  { value: 'question', label: 'Hỏi đáp', icon: '❓' },
  { value: 'discussion', label: 'Thảo luận', icon: '💬' },
  { value: 'share', label: 'Chia sẻ', icon: '📚' },
  { value: 'announcement', label: 'Thông báo', icon: '📢' },
];

const AVAILABLE_TAGS = [
  'Python', 'Java', 'JavaScript', 'React', 'Database', 
  'Algorithm', 'Web Development', 'Machine Learning',
  'C++', 'C#', 'Node.js', 'TypeScript', 'SQL', 'MongoDB',
  'HTML', 'CSS', 'Tailwind', 'Next.js', 'Vue.js', 'Angular',
];

export default function ForumFilter({ 
  activeSort, 
  onSortChange,
  selectedCategories = [],
  onCategoriesChange,
  selectedTags = [],
  onTagsChange,
}: ForumFilterProps) {
  const [tagSearchInput, setTagSearchInput] = useState('');
  const [filteredAvailableTags, setFilteredAvailableTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: 'hot', label: 'Phổ biến', icon: '🔥' },
    { value: 'new', label: 'Mới nhất', icon: '🆕' },
    { value: 'top', label: 'Nhiều vote', icon: '⭐' },
    { value: 'unanswered', label: 'Chưa trả lời', icon: '❓' },
  ];

  const toggleCategory = (category: string) => {
    if (!onCategoriesChange) return;
    
    // If "all" is clicked, clear all selections
    if (category === 'all') {
      onCategoriesChange([]);
      return;
    }
    
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoriesChange([...selectedCategories, category]);
    }
  };

  const handleTagSearch = (query: string) => {
    setTagSearchInput(query);
    setShowTagDropdown(true);
    
    if (query.trim()) {
      const filtered = AVAILABLE_TAGS.filter(tag => 
        tag.toLowerCase().includes(query.toLowerCase()) &&
        !selectedTags.includes(tag) // Exclude already selected tags
      );
      setFilteredAvailableTags(filtered);
    } else {
      // Show all available tags when input is empty
      const availableTags = AVAILABLE_TAGS.filter(tag => !selectedTags.includes(tag));
      setFilteredAvailableTags(availableTags);
    }
  };

  const addTagFromSearch = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange?.([...selectedTags, tag]);
    }
    setTagSearchInput('');
    setShowTagDropdown(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange?.(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 space-y-4">
      {/* Sort Options */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Sắp xếp</h4>
        <div className="flex gap-2 flex-wrap">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                activeSort === option.value
                  ? 'bg-slate-600 text-white shadow-sm border-slate-600'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter - Always visible */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Loại bài viết {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </h4>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((category) => {
            const isSelected = category.value === 'all' 
              ? selectedCategories.length === 0 
              : selectedCategories.includes(category.value);
            
            return (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                  isSelected
                    ? 'bg-emerald-500 text-white shadow-sm border-emerald-500'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags Filter - Search Input with Chips */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Chủ đề {selectedTags.length > 0 && `(${selectedTags.length})`}
        </h4>
        
        {/* Tag Search Input with Selected Tags Inside */}
        <div className="relative">
          <div 
            className="w-full min-h-[42px] px-3 py-2 text-sm border border-gray-300 rounded-lg focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-400 bg-white cursor-text flex flex-wrap gap-1.5 items-center"
            onClick={() => {
              setShowTagDropdown(true);
              if (tagSearchInput === '' && filteredAvailableTags.length === 0) {
                handleTagSearch('');
              }
            }}
          >
            {/* Selected Tags as Chips */}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md text-xs font-medium border border-indigo-200"
              >
                #{tag}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag);
                  }}
                  className="hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            
            {/* Input */}
            <input
              type="text"
              placeholder={selectedTags.length === 0 ? "Tìm kiếm chủ đề... (Python, Java, React...)" : ""}
              value={tagSearchInput}
              onChange={(e) => handleTagSearch(e.target.value)}
              onFocus={() => {
                setShowTagDropdown(true);
                if (filteredAvailableTags.length === 0) {
                  handleTagSearch('');
                }
              }}
              onBlur={() => setShowTagDropdown(false)}
              className="flex-1 min-w-[120px] outline-none bg-transparent"
            />
            
            <svg 
              className="w-4 h-4 text-gray-400 flex-shrink-0 pointer-events-none"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Dropdown suggestions */}
          {showTagDropdown && filteredAvailableTags.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-md max-h-48 overflow-y-auto">
              {filteredAvailableTags.map((tag) => (
                <button
                  key={tag}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur event
                    addTagFromSearch(tag);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                >
                  <span className="text-gray-600">#</span>
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
