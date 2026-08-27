import {
  BookOpen,
  Calculator,
  Moon,
  Sun,
  Printer,
  Menu,
  X,
  ShieldCheck,
  WifiOff,
  RotateCw,
} from 'lucide-react';
import React, { useState } from 'react';
import { clearAppCacheAndReload } from '../register-sw';

interface HeaderProps {
  darkMode: boolean;
  isOffline: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCalculator: () => void;
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  isOffline,
  setDarkMode,
  onOpenCalculator,
  onSelectCategory,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = async () => {
    setIsClearing(true);
    await clearAppCacheAndReload();
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#e3dcce]/90 bg-[#f7f4ec]/92 shadow-[0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/95 no-print transition-colors">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:h-[76px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#e3dcce] bg-white text-slate-700 transition-all hover:border-blue-300 hover:bg-[#ede6d4] hover:text-blue-900 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 lg:hidden"
            aria-label={isMobileSidebarOpen ? '關閉法規目錄' : '開啟法規目錄'}
            aria-expanded={isMobileSidebarOpen}
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            className="group flex min-w-0 items-center gap-2.5 text-left sm:gap-3"
            onClick={() => onSelectCategory('ALL')}
            aria-label="回到法規檢索首頁"
          >
            <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1b4d82] via-[#153e6b] to-[#0e2744] text-white shadow-lg shadow-blue-950/20 ring-1 ring-white/20 transition-transform group-hover:-rotate-2 group-hover:scale-[1.03] sm:h-11 sm:w-11">
              <BookOpen className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.8} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#137966] dark:border-slate-950">
                <ShieldCheck className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="block truncate text-base font-extrabold tracking-[-0.02em] text-[#1c222b] dark:text-white sm:text-[19px]">
                  <span className="sm:hidden">退輔法規</span>
                  <span className="hidden sm:inline">退輔會法規檢索</span>
                </span>
                <span className="hidden rounded-full border border-emerald-300 bg-[#edf8f4] px-2 py-0.5 text-[11px] font-bold tracking-wide text-[#116d5b] dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 sm:inline-flex">
                  承辦人專用
                </span>
              </span>
              <span className="mt-0.5 hidden text-xs font-medium tracking-[0.02em] text-[#646a77] dark:text-slate-400 md:block">
                115 年最新修訂 · 法規全文與津貼試算
              </span>
            </span>
          </button>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          {isOffline && (
            <span className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-amber-300 bg-[#fef9eb] px-2 text-xs font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200" title="目前使用已快取的離線內容">
              <WifiOff className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">離線可用</span>
            </span>
          )}

          {/* Quick Clear Cache & Refresh Button */}
          <button
            onClick={handleClearCache}
            disabled={isClearing}
            className="flex h-10 items-center gap-1.5 rounded-xl border border-[#e3dcce] bg-white px-2.5 text-xs font-bold text-[#646a77] shadow-sm transition-all hover:border-blue-300 hover:bg-[#ede6d4] hover:text-[#1b4d82] active:scale-[0.97] disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300"
            title="清除離線快取並強制檢查最新版本"
            aria-label="清除離線快取並強制檢查最新版本"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isClearing ? 'animate-spin text-[#1b4d82]' : ''}`} />
            <span className="hidden xl:inline">檢查更新</span>
          </button>

          <button
            onClick={onOpenCalculator}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#1b4d82] px-3 text-xs font-bold text-white shadow-md shadow-blue-950/15 transition-all hover:bg-[#143d68] active:scale-[0.97] sm:h-11 sm:px-4 sm:text-sm"
          >
            <Calculator className="h-4 w-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">津貼與試算器</span>
            <span className="sm:hidden">試算</span>
          </button>

          <button
            onClick={() => window.print()}
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-[#5b616e] transition-all hover:bg-[#eee7d8] hover:text-slate-900 active:scale-[0.97] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:flex"
            title="列印當前畫面"
            aria-label="列印當前畫面"
          >
            <Printer className="h-[18px] w-[18px]" />
          </button>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-[0.97] xl:w-auto xl:gap-2 xl:px-3 ${darkMode ? 'bg-slate-800 text-amber-300 hover:bg-slate-700 dark:text-amber-200' : 'bg-[#eee7d8] text-slate-700 hover:bg-[#e4dcce] hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'}` }
            title={darkMode ? '切換亮色模式' : '切換深色模式'}
            aria-label={darkMode ? '切換亮色模式' : '切換深色模式'}
            aria-pressed={darkMode}
          >
            {darkMode ? <Sun className="h-[18px] w-[18px] text-amber-300" /> : <Moon className="h-[18px] w-[18px]" />}
            <span className="hidden text-xs font-bold xl:inline">{darkMode ? '亮色' : '深色'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
