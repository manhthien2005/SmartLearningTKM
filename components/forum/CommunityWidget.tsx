'use client';

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  posts: number;
  reputation: number; // Điểm uy tín từ upvotes
  helpfulAnswers: number; // Số câu trả lời hữu ích
  avatar?: string;
}

interface CommunityWidgetProps {
  topMembers: CommunityMember[];
}

export default function CommunityWidget({ topMembers }: CommunityWidgetProps) {
  const isTeacher = (role: string) => role.toLowerCase().includes('giảng viên') || role.toLowerCase().includes('giáo viên');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Top Cộng Đồng
      </h3>
      
      <div className="mb-3 p-2 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 Xếp hạng dựa trên <span className="font-semibold">Điểm uy tín</span> từ upvotes và câu trả lời hữu ích
        </p>
      </div>
      
      <div className="space-y-3">
        {topMembers.map((member, index) => (
          <div key={member.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            isTeacher(member.role) ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-gray-50'
          }`}>
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  isTeacher(member.role)
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  {member.name.charAt(0)}
                </div>
                {index < 3 && (
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                  }`}>
                    {index + 1}
                  </div>
                )}
                {isTeacher(member.role) && (
                  <div className="absolute -top-1 -left-1 text-xs">⭐</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <div className="font-medium text-gray-900 truncate">{member.name}</div>
                  {isTeacher(member.role) && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">GV</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{member.posts} bài</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-green-600 font-medium">✓ {member.helpfulAnswers} hữu ích</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-lg font-bold text-amber-600">{member.reputation}</span>
              </div>
              <div className="text-xs text-gray-400">điểm uy tín</div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium">
        Xem tất cả thành viên
      </button>
    </div>
  );
}
