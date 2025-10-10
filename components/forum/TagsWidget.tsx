'use client';

export interface TagData {
  name: string;
  count: number;
  color: string;
}

interface TagsWidgetProps {
  tags: TagData[];
  onTagClick?: (tag: string) => void;
}

export default function TagsWidget({ tags, onTagClick }: TagsWidgetProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Thẻ Phổ Biến
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.name}
            onClick={() => onTagClick?.(tag.name)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 border ${tag.color} ${
              tag.color.includes('bg-blue') ? 'border-blue-200' :
              tag.color.includes('bg-yellow') ? 'border-yellow-200' :
              tag.color.includes('bg-red') ? 'border-red-200' :
              tag.color.includes('bg-purple') ? 'border-purple-200' :
              tag.color.includes('bg-pink') ? 'border-pink-200' :
              tag.color.includes('bg-indigo') ? 'border-indigo-200' :
              tag.color.includes('bg-orange') ? 'border-orange-200' :
              tag.color.includes('bg-green') ? 'border-green-200' :
              tag.color.includes('bg-cyan') ? 'border-cyan-200' :
              tag.color.includes('bg-rose') ? 'border-rose-200' :
              'border-gray-200'
            }`}
          >
            {tag.name}
            <span className="ml-1.5 text-xs opacity-75">({tag.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
