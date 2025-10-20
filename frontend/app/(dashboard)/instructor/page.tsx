'use client';

import { AcademicCapIcon, UsersIcon, ClipboardDocumentListIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function TeacherDashboard() {
  const stats = [
    { name: 'Khoá Học', value: '4', icon: AcademicCapIcon, color: 'bg-blue-500' },
    { name: 'Sinh Viên', value: '156', icon: UsersIcon, color: 'bg-green-500' },
    { name: 'Bài Tập Chưa Chấm', value: '23', icon: ClipboardDocumentListIcon, color: 'bg-orange-500' },
    { name: 'Điểm TB Lớp', value: '7.8', icon: ChartBarIcon, color: 'bg-purple-500' },
  ];

  const courses = [
    { id: 1, name: 'Lập Trình Web', students: 45, assignments: 8, nextClass: 'Thứ 2, 13:30', room: 'A101' },
    { id: 2, name: 'Cấu Trúc Dữ Liệu', students: 52, assignments: 5, nextClass: 'Thứ 3, 09:00', room: 'B205' },
    { id: 3, name: 'Cơ Sở Dữ Liệu', students: 38, assignments: 7, nextClass: 'Thứ 4, 15:00', room: 'C310' },
    { id: 4, name: 'Thuật Toán', students: 21, assignments: 4, nextClass: 'Thứ 5, 10:30', room: 'A203' },
  ];

  const pendingAssignments = [
    { id: 1, title: 'Bài Tập Tuần 5', course: 'Lập Trình Web', submitted: 38, total: 45, dueDate: '15/10/2025' },
    { id: 2, title: 'Project Giữa Kỳ', course: 'Cấu Trúc Dữ Liệu', submitted: 45, total: 52, dueDate: '20/10/2025' },
    { id: 3, title: 'Thực Hành SQL', course: 'Cơ Sở Dữ Liệu', submitted: 30, total: 38, dueDate: '12/10/2025' },
  ];

  const recentActivities = [
    { id: 1, student: 'Nguyễn Văn A', action: 'đã nộp bài', assignment: 'Bài Tập Tuần 4', time: '30 phút trước' },
    { id: 2, student: 'Trần Thị B', action: 'đã hỏi câu hỏi trong', assignment: 'Diễn Đàn', time: '1 giờ trước' },
    { id: 3, student: 'Lê Văn C', action: 'đã nộp bài', assignment: 'Project Tuần 3', time: '2 giờ trước' },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Giảng Viên</h1>
        <p className="text-gray-600 mt-2">Xin chào, Mr. Thiên! Quản lý lớp học của bạn</p>
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
        {/* My Courses */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Khoá Học Của Tôi</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-3 truncate">{course.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Sinh viên:</span>
                      <span className="font-medium text-gray-900">{course.students}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span>Bài tập:</span>
                      <span className="font-medium text-gray-900">{course.assignments}</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500">Buổi học tiếp theo:</p>
                      <p className="text-sm text-gray-900 font-medium truncate">{course.nextClass} - Phòng {course.room}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-w-0">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Bài Tập Chờ Chấm</h2>
          </div>
          <div className="p-6 space-y-3">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-sm transition-all cursor-pointer min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{assignment.title}</h3>
                <p className="text-xs text-gray-600 mb-3 truncate">{assignment.course}</p>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Đã nộp</span>
                    <span className="font-medium text-gray-900">{assignment.submitted}/{assignment.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Hạn: {assignment.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full min-w-0">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hoạt Động Gần Đây</h2>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors min-w-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold text-sm">{activity.student.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">
                  <span className="font-semibold">{activity.student}</span> {activity.action} <span className="font-semibold">{activity.assignment}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

