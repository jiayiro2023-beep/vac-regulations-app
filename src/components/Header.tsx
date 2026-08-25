import {
  BookOpen,
  Calculator,
  Moon,
  Sun,
  Printer,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenCalculator: () => void;
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenCalculator,
  onSelectCategory,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/88 no-print transition-colors">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-3 px-3 sm:h-[76px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[0.97] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 lg:hidden"
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
            <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#1d5b96] via-[#174776] to-[#102b4a] text-white shadow-lg shadow-blue-900/15 ring-1 ring-white/20 transition-transform group-hover:-rotate-2 group-hover:scale-[1.03] sm:h-11 sm:w-11">
              <BookOpen className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.8} />
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#169a82] dark:border-slate-950">
                <ShieldCheck className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
              </span>
            </span>
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-1.5">
                <span className="block truncate text-[15px] font-extrabold tracking-[-0.02em] text-slate-900 dark:text-white sm:text-[18px]">
                  <span className="sm:hidden">退輔法規</span>
                  <span className="hidden sm:inline">退輔會法規檢索</span>
                </span>
                <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 sm:inline-flex">
                  承辦人專用
                </span>
              </span>
              <span className="mt-0.5 hidden text-[11px] font-medium tracking-[0.02em] text-slate-500 dark:text-slate-400 md:block">
                115 年最新修訂 · 法規全文與津貼試算
              </span>
            </span>
          </button>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenCalculator}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#1b568f] px-3 text-xs font-bold text-white shadow-md shadow-blue-900/15 transition-all hover:bg-[#154574] active:scale-[0.97] sm:h-11 sm:px-4 sm:text-sm"
          >
            <Calculator className="h-4 w-4" strokeWidth={2.2} />
            <span className="hidden sm:inline">津貼與試算器</span>
            <span className="sm:hidden">試算</span>
          </button>

          <button
            onClick={() => window.print()}
            className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-[0.97] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white sm:flex"
            title="列印當前畫面"
            aria-label="列印當前畫面"
          >
            <Printer className="h-[18px] w-[18px]" />
          </button>

          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-[0.97] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            title={darkMode ? '切換亮色模式' : '切換深色模式'}
            aria-label={darkMode ? '切換亮色模式' : '切換深色模式'}
          >
            {darkMode ? <Sun className="h-[18px] w-[18px] text-amber-300" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
