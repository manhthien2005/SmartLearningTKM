'use client';

export type CategoryType = 'all' | 'question' | 'discussion' | 'share' | 'announcement';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onCategoryChange: (category: CategoryType) => void;
}

const CATEGORIES = [
  { value: 'all' as CategoryType, label: '🌐 Tất cả', color: 'bg-gray-100 text-gray-700' },
  { value: 'question' as CategoryType, label: '❓ Hỏi đáp', color: 'bg-green-100 text-green-700' },
  { value: 'discussion' as CategoryType, label: '💬 Thảo luận', color: 'bg-blue-100 text-blue-700' },
  { value: 'share' as CategoryType, label: '📚 Chia sẻ', color: 'bg-purple-100 text-purple-700' },
  { value: 'announcement' as CategoryType, label: '📢 Thông báo', color: 'bg-orange-100 text-orange-700' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Loại Bài Viết
      </h3>
      
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
              selectedCategory === category.value
                ? `${category.color} ring-2 ring-offset-2 ring-blue-500 shadow-md`
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
