'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';

type DashboardLayoutProps = {
  children: ReactNode;
  role: 'student' | 'teacher';
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(56); // 14 * 4 = 56px (w-14)

  const handleSidebarChange = useCallback(() => {
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      const width = sidebar.offsetWidth;
      // Đảm bảo width trong khoảng hợp lệ và debounce
      const validWidth = Math.max(56, Math.min(width, 224));
      
      // Chỉ update nếu width thực sự thay đổi để tránh re-render không cần thiết
      setSidebarWidth(prev => prev !== validWidth ? validWidth : prev);
    }
  }, []);

  useEffect(() => {
    // Initial measurement với delay nhỏ để đảm bảo DOM ready
    const timer = setTimeout(handleSidebarChange, 100);

    // Create observer với throttle để tránh quá nhiều updates
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      let rafId: number;
      
      const resizeObserver = new ResizeObserver(() => {
        // Cancel previous frame nếu có
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        
        // Schedule update trong next frame
        rafId = requestAnimationFrame(handleSidebarChange);
      });
      
      resizeObserver.observe(sidebar);
      
      return () => {
        clearTimeout(timer);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        resizeObserver.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, [handleSidebarChange]);

  return (
    <div className="min-h-screen bg-[#f5f5fa] overflow-x-hidden">
      <Sidebar role={role} />
      <main 
        className="transition-all duration-200 ease-out overflow-x-hidden"
        style={{ 
          marginLeft: `${sidebarWidth}px`,
          width: `calc(100vw - ${sidebarWidth}px)`,
          minWidth: 0,
          maxWidth: `calc(100vw - ${sidebarWidth}px)`,
          willChange: 'margin-left, width' // Optimize for layout changes
        }}
      >
        <div className="p-4 lg:p-6 w-full min-w-0 max-w-full overflow-x-hidden">
          <div className="w-full min-w-0 max-w-full overflow-x-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

