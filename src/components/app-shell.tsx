"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, BookOpen, Flame, Moon, Sun, 
  LayoutDashboard, Compass, Headphones, BookOpenCheck, Landmark
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Sync dark mode state
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const menuItems = [
    { name: "Bảng Điều Khiển", href: "/dashboard", icon: LayoutDashboard },
    { name: "Lộ Trình Học", href: "/plan", icon: Compass },
    { name: "Học Từ Vựng (Leitner)", href: "/vocab", icon: BookOpen },
    { name: "Luyện Nghe (Part 1-4)", href: "/practice/listening", icon: Headphones },
    { name: "Luyện Đọc (Part 5-7)", href: "/practice/reading", icon: BookOpenCheck },
    { name: "Thi Mock Test", href: "/tests", icon: Landmark },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-200">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen transition-colors duration-200">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <span className="font-display text-2xl font-bold text-primary dark:text-primary">
            TOEIC<span className="text-secondary">Master</span>
          </span>
          <span className="bg-primary/10 text-primary dark:bg-primary/20 text-xs px-2 py-0.5 rounded-full font-bold">
            VN
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? "bg-primary text-white shadow-md shadow-primary/25" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 2. Mobile Slide-out Drawer Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-slate-900 h-full p-6 shadow-xl border-r border-slate-200 dark:border-slate-800 transition-colors duration-200 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-2xl font-bold text-primary">
                TOEIC<span className="text-secondary">Master</span>
              </span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active 
                        ? "bg-primary text-white shadow-md shadow-primary/25" 
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* 3. Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Upper Header Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Bảng Mục Tiêu:</span>
            <span className="bg-secondary/15 text-secondary dark:bg-secondary/25 px-2.5 py-0.5 rounded-full font-display font-semibold text-sm">
              Target 650+
            </span>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-500 rounded-full font-semibold text-sm">
              <Flame className="w-4.5 h-4.5 fill-amber-600 dark:fill-amber-500" />
              <span>5 ngày liên tiếp</span>
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* User Profile placeholder */}
            <div className="w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm">
              M
            </div>
          </div>
        </header>

        {/* Dynamic Page Workspace Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
