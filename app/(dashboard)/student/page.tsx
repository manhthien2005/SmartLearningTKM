'use client';

import { BookOpenIcon, ClockIcon, ChartBarIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function StudentDashboard() {
  const stats = [
    { name: 'Khoá Học Đang Học', value: '5', icon: BookOpenIcon, color: 'bg-blue-500' },
    { name: 'Bài Tập Sắp Đến', value: '3', icon: ClockIcon, color: 'bg-orange-500' },
    { name: 'Điểm Trung Bình', value: '8.5', icon: ChartBarIcon, color: 'bg-green-500' },
    { name: 'Hoàn Thành', value: '12', icon: AcademicCapIcon, color: 'bg-purple-500' },
  ];

  const recentCourses = [
    { id: 1, name: 'Lập Trình Web', progress: 75, instructor: 'TS. Nguyễn Văn A', nextClass: 'Thứ 2, 13:30' },
    { id: 2, name: 'Cấu Trúc Dữ Liệu', progress: 60, instructor: 'TS. Trần Thị B', nextClass: 'Thứ 3, 09:00' },
    { id: 3, name: 'Cơ Sở Dữ Liệu', progress: 85, instructor: 'PGS. Lê Văn C', nextClass: 'Thứ 4, 15:00' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Bài Tập Tuần 5', course: 'Lập Trình Web', dueDate: '15/10/2025', status: 'pending' },
    { id: 2, title: 'Project Giữa Kỳ', course: 'Cấu Trúc Dữ Liệu', dueDate: '20/10/2025', status: 'in-progress' },
    { id: 3, title: 'Thực Hành SQL', course: 'Cơ Sở Dữ Liệu', dueDate: '12/10/2025', status: 'pending' },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Xin chào, Mr. Thiên!</h1>
        <p className="text-gray-600 mt-2">Chào mừng trở lại với SmartLearning</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow min-w-0">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-600 font-medium truncate">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg flex-shrink-0`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Recent Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Khoá Học Gần Đây</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentCourses.map((course) => (
              <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{course.name}</h3>
                    <p className="text-sm text-gray-600 mt-1 truncate">{course.instructor}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium flex-shrink-0 ml-2">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 truncate">Buổi học tiếp theo: {course.nextClass}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Bài Tập Sắp Đến</h2>
          </div>
          <div className="p-6 space-y-3">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{assignment.title}</h3>
                <p className="text-xs text-gray-600 mb-2 truncate">{assignment.course}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex-shrink-0">{assignment.dueDate}</span>
                  <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                    assignment.status === 'in-progress' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {assignment.status === 'in-progress' ? 'Đang làm' : 'Chưa làm'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full min-w-0">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt Động Gần Đây</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-0">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">Đã hoàn thành <span className="font-semibold">Bài Tập Tuần 4</span></p>
              <p className="text-xs text-gray-500">2 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-0">
            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">Đã tham gia lớp học <span className="font-semibold">Lập Trình Web</span></p>
              <p className="text-xs text-gray-500">5 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-0">
            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">Đã nhận được điểm cho <span className="font-semibold">Project Tuần 3</span></p>
              <p className="text-xs text-gray-500">1 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

