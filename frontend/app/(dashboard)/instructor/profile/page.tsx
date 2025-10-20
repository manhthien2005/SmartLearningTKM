'use client';

import { UserCircleIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, AcademicCapIcon, CalendarIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

export default function TeacherProfilePage() {
  const teacherInfo = {
    name: 'Mr. Thiên',
    email: 'thien.teacher@smartlearning.edu.vn',
    phone: '0123 456 789',
    address: 'Hà Nội, Việt Nam',
    teacherId: 'GV2020001',
    department: 'Khoa Công Nghệ Thông Tin',
    position: 'Giảng Viên',
    degree: 'Thạc Sĩ Khoa Học Máy Tính',
    experience: '5 năm',
    joinDate: '01/09/2020',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ Sơ Cá Nhân</h1>
        <p className="text-gray-600 mt-2">Thông tin chi tiết về tài khoản của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">T</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{teacherInfo.name}</h2>
              <p className="text-gray-600 mt-1">Giảng Viên</p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span>{teacherInfo.department}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mt-2">
                  <AcademicCapIcon className="w-4 h-4" />
                  <span>{teacherInfo.position}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Thông Tin Chi Tiết</h3>
            
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Thông Tin Liên Hệ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{teacherInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <PhoneIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Số Điện Thoại</p>
                      <p className="font-medium text-gray-900">{teacherInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                    <MapPinIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Địa Chỉ</p>
                      <p className="font-medium text-gray-900">{teacherInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Thông Tin Nghề Nghiệp</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Mã Giảng Viên</p>
                    <p className="font-bold text-blue-900">{teacherInfo.teacherId}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Chức Vụ</p>
                    <p className="font-bold text-green-900">{teacherInfo.position}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Bằng Cấp</p>
                    <p className="font-bold text-purple-900">{teacherInfo.degree}</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Kinh Nghiệm</p>
                    <p className="font-bold text-orange-900">{teacherInfo.experience}</p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg md:col-span-2">
                    <p className="text-sm text-indigo-600">Khoa</p>
                    <p className="font-bold text-indigo-900">{teacherInfo.department}</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg md:col-span-2">
                    <p className="text-sm text-pink-600">Ngày Vào Làm</p>
                    <p className="font-bold text-pink-900">{teacherInfo.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Chỉnh Sửa Hồ Sơ
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Đổi Mật Khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
