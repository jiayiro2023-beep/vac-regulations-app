import React from 'react';
import { 
  BookOpen, 
  Calculator, 
  Moon, 
  Sun, 
  Printer, 
  FileText,
  BookmarkCheck,
  Building2,
  Award
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
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenCalculator,
  bookmarkedCount,
  onToggleBookmarksOnly,
  showBookmarksOnly,
  activeCategory,
  onSelectCategory
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 glass-panel shadow-sm no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectCategory('ALL')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-blue-100 dark:to-indigo-200 bg-clip-text text-transparent">
                退輔會法規智慧檢索平台
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                承辦人專用
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              100% 完整抽取 • 就學就業職訓津貼金額試算 • 115年最新修訂版本
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Bookmark filter */}
          <button
            onClick={onToggleBookmarksOnly}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              showBookmarksOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
            title="查看已書籤儲存之條文"
          >
            <BookmarkCheck className="w-4 h-4" />
            <span className="hidden md:inline">已書籤</span>
            {bookmarkedCount > 0 && (
              <span className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                showBookmarksOnly ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
              }`}>
                {bookmarkedCount}
              </span>
            )}
          </button>

          {/* Calculator modal button */}
          <button
            onClick={onOpenCalculator}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Calculator className="w-4 h-4" />
            <span>津貼與試算器</span>
          </button>

          {/* Print button */}
          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="列印當前畫面"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Dark Mode toggle */}
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title={darkMode ? "切換亮色模式" : "切換深色模式"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
