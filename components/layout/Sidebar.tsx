'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  UsersIcon as UsersIconSolid,
  SparklesIcon as SparklesIconSolid,
  DocumentMagnifyingGlassIcon as DocumentMagnifyingGlassIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
} from '@heroicons/react/24/solid';
import Image from 'next/image';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
};

type NavSection = {
  title?: string;
  items: NavItem[];
};

type SidebarProps = {
  role: 'student' | 'teacher';
};

export default function Sidebar({ role }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Mặc định collapsed
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();

  // Debounce hover để tránh giật
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    
    if (!isHovered) {
      setIsTransitioning(true);
      setIsHovered(true);
      // Clear transitioning state sau khi animation hoàn thành
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Delay nhỏ để tránh flicker khi di chuyển chuột nhanh
    const timeout = setTimeout(() => {
      setIsTransitioning(true);
      setIsHovered(false);
      setTimeout(() => setIsTransitioning(false), 200);
    }, 100);
    
    setHoverTimeout(timeout);
  };

  // Auto-collapse sau khi không hover trong 3 giây (tăng thời gian)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (!isHovered && !isCollapsed) {
      timeoutId = setTimeout(() => {
        if (!isTransitioning) { // Chỉ collapse khi không đang transition
          setIsCollapsed(true);
        }
      }, 3000); // Tăng từ 2s lên 3s
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovered, isCollapsed, isTransitioning]);

  // Cleanup hover timeout
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const studentNavSections: NavSection[] = [
    {
      // Phần bình thường - không có title
      items: [
        { name: 'Bảng Điều Khiển', href: `/student`, icon: HomeIcon, iconSolid: HomeIconSolid },
      ]
    },
    {
      title: 'Tính Năng',
      items: [
        { name: 'Khoá Học', href: `/student/courses`, icon: BookOpenIcon, iconSolid: BookOpenIconSolid },
        { name: 'Tài Liệu', href: `/student/documents`, icon: DocumentTextIcon, iconSolid: DocumentTextIconSolid },
      ]
    },
    {
      title: 'Trao Đổi',
      items: [
        { name: 'Gia Sư AI', href: `/student/ai-tutor`, icon: SparklesIcon, iconSolid: SparklesIconSolid },
        { name: 'Diễn Đàn', href: `/student/forum`, icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
      ]
    },
    {
      title: 'Công Cụ',
      items: [
        { name: 'Tóm Tắt', href: `/student/summary`, icon: DocumentMagnifyingGlassIcon, iconSolid: DocumentMagnifyingGlassIconSolid },
        { name: 'Tạo Bài Tập', href: `/student/create-exercise`, icon: PlusCircleIcon, iconSolid: PlusCircleIconSolid },
      ]
    }
  ];

  const teacherNavSections: NavSection[] = [
    {
      // Phần bình thường - không có title
      items: [
        { name: 'Bảng Điều Khiển', href: `/teacher`, icon: HomeIcon, iconSolid: HomeIconSolid },
      ]
    },
    {
      title: 'Tính Năng',
      items: [
        { name: 'Khoá Học', href: `/teacher/courses`, icon: AcademicCapIcon, iconSolid: AcademicCapIconSolid },
        { name: 'Bài Tập', href: `/teacher/assignments`, icon: ClipboardDocumentListIcon, iconSolid: ClipboardDocumentListIconSolid },
        { name: 'Sinh Viên', href: `/teacher/students`, icon: UsersIcon, iconSolid: UsersIconSolid },
      ]
    },
    {
      title: 'Trao Đổi',
      items: [
        { name: 'Gia Sư AI', href: `/teacher/ai-tutor`, icon: SparklesIcon, iconSolid: SparklesIconSolid },
        { name: 'Diễn Đàn', href: `/teacher/forum`, icon: ChatBubbleLeftRightIcon, iconSolid: ChatBubbleLeftRightIconSolid },
      ]
    },
    {
      title: 'Công Cụ',
      items: [
        { name: 'Tóm Tắt', href: `/teacher/summary`, icon: DocumentMagnifyingGlassIcon, iconSolid: DocumentMagnifyingGlassIconSolid },
        { name: 'Tạo Bài Tập', href: `/teacher/create-exercise`, icon: PlusCircleIcon, iconSolid: PlusCircleIconSolid },
      ]
    }
  ];

  const navSections = role === 'student' ? studentNavSections : teacherNavSections;
  const showExpanded = (!isCollapsed || isHovered) && !isTransitioning;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-200 ease-out z-40 overflow-hidden ${
        showExpanded ? 'w-56' : 'w-14'
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        maxWidth: showExpanded ? '224px' : '56px',
        willChange: 'width' // Optimize for width changes
      }}
    >
      <div className="flex flex-col h-full w-full overflow-hidden"
           style={{ 
             width: showExpanded ? '224px' : '56px',
             willChange: 'width'
           }}>
        {/* Header với Logo */}
        <div className="flex items-center justify-between h-12 px-3 border-b border-gray-200 min-w-0 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <div className="w-6 h-6 relative flex-shrink-0">
              <Image
                src="/small_logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            {showExpanded && (
              <span className="font-semibold text-gray-800 text-base whitespace-nowrap flex-shrink-0">
                Smart Learning
              </span>
            )}
          </div>
          {showExpanded && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto overflow-x-hidden">
          <div className="space-y-2 w-full">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="w-full">
                {/* Section Title */}
                {section.title && sectionIndex > 0 && (
                  <div className="flex items-center mb-2 mt-3">
                    {showExpanded ? (
                      <>
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white pr-3">
                          {section.title}
                        </h3>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </>
                    ) : (
                      <div className="w-full border-t border-gray-300"></div>
                    )}
                  </div>
                )}
                {section.title && showExpanded && sectionIndex === 0 && (
                  <div className="mb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                {/* Section Items */}
                <ul className="space-y-1 w-full">
                  {section.items.map((item) => {
                    // Fix logic active state - exact match cho dashboard, startsWith cho sub-routes
                    const isActive = pathname === item.href || 
                      (item.href !== `/${role}` && pathname?.startsWith(`${item.href}/`));
                    const Icon = isActive ? item.iconSolid : item.icon;

                    return (
                      <li key={item.name} className="w-full">
                        <Link
                          href={item.href}
                          className={`flex items-center rounded-md transition-all duration-150 group relative w-full h-9 ${
                            isActive
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {/* Icon container với position cố định - luôn cách lề trái 8px */}
                          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 absolute left-2">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                          </div>
                          
                          {/* Text container với padding-left cố định để tránh đè lên icon */}
                          {showExpanded && (
                            <span className="pl-10 pr-2 py-2 whitespace-nowrap text-sm flex-shrink-0 overflow-hidden w-full">
                              {item.name}
                            </span>
                          )}
                          
                          {/* Tooltip khi collapsed */}
                          {!showExpanded && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50">
                              {item.name}
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

      </div>
    </aside>
  );
}

