import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  resultStats: { regCount: number; matchCount: number };
}

export const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onKeywordChange,
  resultStats
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 py-3 sm:p-4 no-print shadow-sm">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Input box */}
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="輸入關鍵字、條文編號或金額…"
            className="w-full pl-9 sm:pl-11 pr-16 sm:pr-24 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          />
          {keyword ? (
            <button
              onClick={() => onKeywordChange('')}
              className="absolute right-2.5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              title="清除關鍵字"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-2.5 hidden sm:block px-2 py-1 bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 rounded">
              全文即時搜尋
            </div>
          )}
        </div>

        {/* Result Count — shown when keyword active */}
        {keyword && (
          <div className="flex justify-end text-xs">
            <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 animate-fadeIn">
              <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
              <span>找到 {resultStats.regCount} 份法規（共 {resultStats.matchCount} 處符合）</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
