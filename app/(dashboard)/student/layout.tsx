import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Dashboard Sinh Viên - Smart Learning TKM',
  description: 'Bảng điều khiển dành cho sinh viên',
  icons: {
    icon: '/small_logo.png',
    shortcut: '/small_logo.png',
    apple: '/small_logo.png',
  },
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="student">{children}</DashboardLayout>;
}