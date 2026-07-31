import React from 'react';
import { Search, X, Tag, Sparkles } from 'lucide-react';
import { CategoryType } from '../types';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  resultStats: { regCount: number; matchCount: number };
}

const QUICK_TAGS = [
  '穩定就業津貼',
  '就學生活津貼',
  '職業訓練補助',
  '115年7月1日',
  '公營事業',
  '大專校院進修',
  '就業考試',
  '眷屬'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onKeywordChange,
  resultStats
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 no-print shadow-sm">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Input box */}
        <div className="relative flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="輸入關鍵字或條文編號（例如：穩定就業津貼、就學補助、第 3 條、12,000元）..."
            className="w-full pl-11 pr-24 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
          />
          {keyword ? (
            <button
              onClick={() => onKeywordChange('')}
              className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              title="清除關鍵字"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="absolute right-3 px-2 py-1 bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-600 dark:text-slate-300 rounded">
              全文即時搜尋
            </div>
          )}
        </div>

        {/* Quick Suggestion Tags & Result Count */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1 font-medium text-[11px]">
              <Tag className="w-3 h-3" /> 熱門檢索：
            </span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => onKeywordChange(tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  keyword === tag
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {keyword && (
            <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>找到 {resultStats.regCount} 份法規（共 {resultStats.matchCount} 處符合）</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
