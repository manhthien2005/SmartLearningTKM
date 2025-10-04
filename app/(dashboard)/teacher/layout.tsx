import type { Metadata } from 'next';
import DashboardLayout from '@/components/DashboardLayout';

export const metadata: Metadata = {
  title: 'Dashboard Giảng Viên - Smart Learning TKM',
  description: 'Bảng điều khiển dành cho giảng viên',
  icons: {
    icon: '/small_logo.png',
    shortcut: '/small_logo.png',
    apple: '/small_logo.png',
  },
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="teacher">{children}</DashboardLayout>;
}