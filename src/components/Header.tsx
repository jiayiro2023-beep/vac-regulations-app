import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Moon, 
  Sun, 
  Printer, 
  BookmarkCheck,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCalculator: () => void;
  bookmarkedCount: number;
  onToggleBookmarksOnly: () => void;
  showBookmarksOnly: boolean;
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenCalculator,
  bookmarkedCount,
  onToggleBookmarksOnly,
  showBookmarksOnly,
  onSelectCategory,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800 glass-panel shadow-sm no-print transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left: mobile menu + brand */}
        <div className="flex items-center gap-2 min-w-0">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(prev => !prev)}
            className="p-2 rounded-xl lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all flex-shrink-0"
            aria-label="切換選單"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          </button>

          {/* Brand */}
          <div 
            className="flex items-center gap-2 cursor-pointer select-none group min-w-0" 
            onClick={() => onSelectCategory('ALL')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* xs: short title; sm+: full title */}
                <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent whitespace-nowrap">
                  <span className="sm:hidden">退輔法規</span>
                  <span className="hidden sm:inline">退輔會法規檢索</span>
                </h1>
                <span className="hidden sm:inline px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 whitespace-nowrap">
                  承辦人專用
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block">
                100% 完整抽取 • 智慧津貼金額試算 • 115年最新修訂
              </p>
            </div>
          </div>
        </div>

        {/* Right: Action controls */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Bookmark filter — icon only on xs */}
          <button
            onClick={onToggleBookmarksOnly}
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              showBookmarksOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
            title="查看已書籤儲存之條文"
          >
            <BookmarkCheck className={`w-4 h-4 flex-shrink-0 ${showBookmarksOnly ? 'text-white' : 'text-amber-500 dark:text-amber-400'}`} />
            <span className="hidden sm:inline">已書籤</span>
            {bookmarkedCount > 0 && (
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-bold leading-none ${
                showBookmarksOnly ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
              }`}>
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Calculator */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Calculator className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">津貼與試算器</span>
            <span className="sm:hidden">試算</span>
          </button>

          {/* Print (desktop only) */}
          <button
            onClick={() => window.print()}
            className="hidden sm:flex p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="列印當前畫面"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title={darkMode ? "切換亮色模式" : "切換深色模式"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
