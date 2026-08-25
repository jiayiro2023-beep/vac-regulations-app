import { Search, X, Sparkles, Command } from 'lucide-react';
import { FontScale, FontSizeNudge } from './FontSizeControl';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  resultStats: { regCount: number; matchCount: number };
  activeCategory: string;
  fontScale: FontScale;
  onFontScaleChange: (value: FontScale) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onKeywordChange,
  resultStats,
  activeCategory,
  fontScale,
  onFontScaleChange,
}) => {
  const scopeLabel = activeCategory === 'ALL' ? '全部法規' : activeCategory;

  return (
    <section className="border-b border-slate-200/80 bg-white/70 px-3 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/55 sm:px-6 sm:py-5 lg:px-8 no-print">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Search the regulations</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-800 dark:text-slate-100 sm:text-[17px]">搜尋法規全文</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 sm:flex">
              <Command className="h-3 w-3" /> 即時檢索
            </span>
            <FontSizeNudge value={fontScale} onChange={onFontScaleChange} />
          </div>
        </div>

        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-blue-500 dark:text-blue-300" />
          <input
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="輸入關鍵字、條文編號或金額…"
            aria-label="搜尋法規全文"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-24 text-base font-medium text-slate-900 shadow-[0_8px_22px_rgba(31,65,102,0.07)] outline-none transition-all placeholder:text-slate-400 hover:border-blue-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-blue-700 sm:h-14 sm:pl-12 sm:text-base"
          />
          {keyword ? (
            <button
              onClick={() => onKeywordChange('')}
              className="absolute right-2.5 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
              title="清除關鍵字"
              aria-label="清除關鍵字"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="pointer-events-none absolute right-3 hidden rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400 sm:inline-flex">全文搜尋</span>
          )}
        </div>

        <div className="mt-2.5 flex min-h-5 items-center justify-between gap-2">
          <span className="truncate text-xs font-medium text-slate-400 dark:text-slate-500 sm:text-[13px]">目前範圍：{scopeLabel}</span>
          {keyword && (
            <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200 animate-fadeIn">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{resultStats.regCount} 份法規 · {resultStats.matchCount} 處符合</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
