import React, { useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  Command,
  ChevronUp,
  ChevronDown,
  FileText,
  Check,
  ArrowRight,
} from 'lucide-react';
import { ReadingPreferences, ReadingSettings } from './ReadingSettings';

export interface SearchMatchNav {
  current: number; // 0-indexed
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export interface MatchingRegulationItem {
  id: string;
  title: string;
  category: string;
  matchCount: number;
  articleMatchCount: number;
}

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (kw: string) => void;
  resultStats: { regCount: number; matchCount: number };
  activeCategory: string;
  readingPreferences: ReadingPreferences;
  onReadingPreferencesChange: (value: ReadingPreferences) => void;
  searchMatchNav?: SearchMatchNav;
  hasSelectedRegulation?: boolean;
  matchingRegulations?: MatchingRegulationItem[];
  selectedRegulationId?: string | null;
  onSelectRegulation?: (id: string) => void;
}

const renderHighlightedText = (text: string, kw: string): React.ReactNode => {
  if (!kw || !kw.trim()) return text;
  const keywordTrimmed = kw.trim();
  const parts = text.split(new RegExp(`(${keywordTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keywordTrimmed.toLowerCase() ? (
      <mark
        key={i}
        className="bg-[#fbe396] text-[#5a3800] dark:bg-amber-700/80 dark:text-amber-100 font-bold px-1 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

const getCategoryBadgeStyle = (category: string) => {
  switch (category) {
    case '穩定就業':
      return 'bg-[#eaf1fb] text-[#1b4d82] border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800';
    case '職業訓練':
      return 'bg-[#e6f4ef] text-[#116d5b] border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800';
    case '就學進修':
      return 'bg-[#eeedfa] text-[#5243aa] border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800';
    case '就業考試':
      return 'bg-[#fef4e2] text-[#9c6010] border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800';
    default:
      return 'bg-[#f4efe4] text-slate-700 border-[#e3dcce] dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
};

export const SearchBar: React.FC<SearchBarProps> = ({
  keyword,
  onKeywordChange,
  resultStats,
  activeCategory,
  readingPreferences,
  onReadingPreferencesChange,
  searchMatchNav,
  hasSelectedRegulation,
  matchingRegulations = [],
  selectedRegulationId,
  onSelectRegulation,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const scopeLabel = activeCategory === 'ALL' ? '全部法規' : activeCategory;

  // Global keyboard shortcut: Cmd+K / Ctrl+K / '/' to focus search input
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (event.key === '/' && !isInput) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (searchMatchNav && searchMatchNav.total > 0) {
        if (event.shiftKey) {
          searchMatchNav.onPrev();
        } else {
          searchMatchNav.onNext();
        }
      }
    } else if (event.key === 'Escape') {
      if (keyword) {
        onKeywordChange('');
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const hasKeyword = Boolean(keyword.trim());

  return (
    <section className="relative z-30 isolate border-b border-[#e3dcce]/90 bg-[#f7f4ec]/80 px-3 py-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/55 sm:px-6 sm:py-5 lg:px-8 no-print">
      <div className="mx-auto max-w-[860px]">
        <div className="mb-2.5 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1b4d82] dark:text-blue-300">Search the regulations</p>
            <h2 className="mt-1 text-base font-extrabold text-[#1c222b] dark:text-slate-100 sm:text-[18px]">搜尋法規全文</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-xs font-semibold text-[#867f70] dark:text-slate-500 sm:flex">
              <Command className="h-3 w-3" /> <kbd className="rounded bg-[#eee7d8] px-1.5 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">⌘K</kbd> 搜尋
            </span>
            <ReadingSettings value={readingPreferences} onChange={onReadingPreferencesChange} />
          </div>
        </div>

        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3.5 h-[18px] w-[18px] text-[#1b4d82] dark:text-blue-300" />
          <input
            id="main-search-input"
            ref={inputRef}
            type="search"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入關鍵字、條文編號或金額… (按 Enter 跳轉符合處)"
            aria-label="搜尋法規全文"
            className="h-12 w-full rounded-2xl border border-[#e3dcce] bg-white pl-11 pr-28 text-base font-medium text-[#21252d] shadow-[0_8px_22px_rgba(70,55,30,0.05)] outline-none transition-all placeholder:text-[#8d8778] hover:border-[#1b4d82]/40 focus:border-[#1b4d82] focus:ring-4 focus:ring-[#1b4d82]/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:hover:border-blue-700 sm:h-14 sm:pl-12 sm:pr-36 sm:text-base"
          />

          {/* Right Action Icons in Input */}
          <div className="absolute right-2 flex items-center gap-1">
            {/* Clear Button */}
            {keyword && (
              <button
                onClick={() => {
                  onKeywordChange('');
                  inputRef.current?.focus();
                }}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-[#eee7d8] hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                title="清除關鍵字 (Esc)"
                aria-label="清除關鍵字"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {!keyword && (
              <span className="pointer-events-none hidden rounded-lg bg-[#eee7d8] px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400 sm:inline-flex">
                全文搜尋
              </span>
            )}
          </div>
        </div>

        {/* Match Navigation & Status Row */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-medium text-[#7d7768] dark:text-slate-400">
            <span className="truncate">範圍：{scopeLabel}</span>
            {hasKeyword && (
              <span className="text-[#867f70] dark:text-slate-600">·</span>
            )}
            {hasKeyword && (
              <span className="truncate font-semibold text-slate-700 dark:text-slate-200">
                {resultStats.regCount} 份法規符合
              </span>
            )}
          </div>

          {/* In-Regulation Match Navigator Toolbar */}
          {hasSelectedRegulation && hasKeyword && (
            <div className="flex items-center gap-1.5 animate-fadeIn">
              {searchMatchNav && searchMatchNav.total > 0 ? (
                <div className="flex items-center gap-1 rounded-xl border border-[#d49e35] bg-[#fffbf2] p-1 shadow-sm dark:border-amber-700 dark:bg-amber-950/40">
                  <span className="px-2 text-xs font-extrabold text-amber-900 dark:text-amber-200">
                    第 {searchMatchNav.current + 1} / {searchMatchNav.total} 處
                  </span>
                  <div className="flex items-center gap-0.5 border-l border-[#e3dcce] pl-1 dark:border-amber-800/80">
                    <button
                      onClick={searchMatchNav.onPrev}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-900 transition-colors hover:bg-amber-100 hover:text-amber-950 dark:text-amber-200 dark:hover:bg-amber-900/60"
                      title="上一個匹配項目 (Shift + Enter)"
                      aria-label="上一個匹配項目"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={searchMatchNav.onNext}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-amber-900 transition-colors hover:bg-amber-100 hover:text-amber-950 dark:text-amber-200 dark:hover:bg-amber-900/60"
                      title="下一個匹配項目 (Enter)"
                      aria-label="下一個匹配項目"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <span className="rounded-xl border border-slate-200 bg-[#faf8f3] px-2.5 py-1 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                  此法規無符合內容
                </span>
              )}
            </div>
          )}

          {/* Global Search result badge when no regulation is selected */}
          {!hasSelectedRegulation && hasKeyword && (
            <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-blue-300 bg-[#eef4fb] px-2.5 py-1 text-xs font-bold text-[#1b4d82] dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200 animate-fadeIn">
              <Sparkles className="h-3.5 w-3.5" />
              <span>共 {resultStats.matchCount} 處符合條文</span>
            </div>
          )}
        </div>

        {/* Matching Regulations Quick Navigation Cards (Shown directly below Search Bar when keyword is searched) */}
        {hasKeyword && matchingRegulations.length > 0 && (
          <div className="mt-3.5 space-y-2 border-t border-[#e3dcce]/80 pt-3 dark:border-slate-800 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1b4d82] dark:text-blue-300">
                <FileText className="h-3.5 w-3.5" />
                <span>相關法規快速切換（共 {matchingRegulations.length} 份）：</span>
              </div>
              <span className="hidden text-[11px] text-[#7d7768] dark:text-slate-400 sm:inline">點擊立即切換檢視</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {matchingRegulations.map((reg) => {
                const isSelected = selectedRegulationId === reg.id;
                return (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => onSelectRegulation?.(reg.id)}
                    className={`group flex items-center justify-between gap-2.5 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#1b4d82] bg-[#edf3fb] shadow-sm ring-2 ring-[#1b4d82]/15 dark:border-blue-500 dark:bg-blue-950/50'
                        : 'border-[#e3dcce] bg-white hover:border-[#1b4d82]/50 hover:bg-[#faf8f3] hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-blue-700 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold ${getCategoryBadgeStyle(reg.category)}`}>
                          {reg.category}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-0.5 rounded-full bg-[#1b4d82] px-2 py-0.5 text-[10px] font-bold text-white dark:bg-blue-600">
                            <Check className="h-3 w-3" /> 目前閱讀
                          </span>
                        ) : (
                          <span className="rounded-full bg-[#eee7d8] px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {reg.articleMatchCount > 0 ? `${reg.articleMatchCount} 條符合` : '標題符合'}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-bold leading-snug text-[#1c222b] group-hover:text-[#1b4d82] dark:text-slate-100 dark:group-hover:text-blue-300">
                        {renderHighlightedText(reg.title, keyword)}
                      </p>
                    </div>
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-xl bg-[#faf8f3] text-slate-400 transition-colors group-hover:bg-[#1b4d82] group-hover:text-white dark:bg-slate-800 dark:group-hover:bg-blue-600">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* No Matches Alert */}
        {hasKeyword && matchingRegulations.length === 0 && (
          <div className="mt-3.5 flex items-center justify-between rounded-2xl border border-[#e3dcce] bg-[#faf8f3] p-3 text-xs text-[#7d7768] dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400 animate-fadeIn">
            <span>查無包含「<strong className="font-bold text-slate-900 dark:text-white">{keyword}</strong>」的相關法規</span>
            <button
              type="button"
              onClick={() => onKeywordChange('')}
              className="font-bold text-[#1b4d82] hover:underline dark:text-blue-300"
            >
              清除搜尋
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
