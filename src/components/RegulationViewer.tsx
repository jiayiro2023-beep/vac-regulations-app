import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { Regulation } from '../data/regulations';
import { VisualFormViewer } from './VisualFormViewer';
import type { FontFamily, FontScale, LineHeight } from './ReadingSettings';
import { FormattedArticleContent } from './FormattedArticleContent';
import { RawTextContent } from './RawTextContent';
import {
  Copy,
  Check,
  ListOrdered,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronUp,
  ChevronDown,
  Search,
  BookOpen,
} from 'lucide-react';

export interface RegulationViewerHandle {
  nextMatch: () => void;
  prevMatch: () => void;
  jumpToMatch: (index: number) => void;
}

interface RegulationViewerProps {
  regulation: Regulation;
  keyword: string;
  fontScale: FontScale;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
  onMatchStatsChange?: (stats: { current: number; total: number }) => void;
}

const renderTitleWithHighlights = (title: string, kw: string): React.ReactNode => {
  if (!kw || !kw.trim()) return title;
  const keywordTrimmed = kw.trim();
  const parts = title.split(new RegExp(`(${keywordTrimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keywordTrimmed.toLowerCase() ? (
      <mark
        key={i}
        data-search-match="true"
        className="search-highlight bg-[#fbe396] dark:bg-amber-700/70 dark:text-amber-100 text-[#633e00] font-bold px-0.5 rounded"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export const RegulationViewer = forwardRef<RegulationViewerHandle, RegulationViewerProps>(({
  regulation,
  keyword,
  fontScale,
  lineHeight,
  fontFamily,
  scrollContainerRef,
  onMatchStatsChange,
}, ref) => {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'attachments'>('articles');
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveTab('articles');
    setShowRawText(false);
    setScrollProgress(0);
  }, [regulation.id]);

  // Track reading progress based on scroll position
  useEffect(() => {
    const calculateProgress = () => {
      const container = scrollContainerRef?.current;
      const content = contentContainerRef.current;

      // 1. Container-based scrolling
      if (container && container.scrollHeight > container.clientHeight + 10) {
        const maxScroll = container.scrollHeight - container.clientHeight;
        if (maxScroll > 0) {
          const pct = Math.min(100, Math.max(0, Math.round((container.scrollTop / maxScroll) * 100)));
          setScrollProgress(pct);
          return;
        }
      }

      // 2. Window/Document-based scrolling
      if (content) {
        const rect = content.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const totalHeight = rect.height;

        if (totalHeight <= windowHeight) {
          setScrollProgress(100);
          return;
        }

        const topOffset = 120; // Top header + search bar offset
        const scrolled = topOffset - rect.top;
        const maxScroll = totalHeight - windowHeight + topOffset;

        if (maxScroll > 0) {
          const pct = Math.min(100, Math.max(0, Math.round((scrolled / maxScroll) * 100)));
          setScrollProgress(pct);
          return;
        }
      }

      // 3. Fallback to document scroll
      const winScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const pct = Math.min(100, Math.max(0, Math.round((winScroll / docHeight) * 100)));
        setScrollProgress(pct);
      }
    };

    calculateProgress();

    const container = scrollContainerRef?.current;
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    container?.addEventListener('scroll', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
      container?.removeEventListener('scroll', calculateProgress);
    };
  }, [regulation.id, activeTab, showRawText, scrollContainerRef]);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      const container = scrollContainerRef?.current;
      if (container) container.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      document.scrollingElement?.scrollTo({ top: 0, behavior: 'auto' });
    };

    scrollToTop();
    const frame = window.requestAnimationFrame(scrollToTop);
    return () => window.cancelAnimationFrame(frame);
  }, [regulation.id, scrollContainerRef]);

  // Jump to specific match index
  const jumpToMatchIndex = (targetIndex: number, scrollIntoView: boolean = true) => {
    if (!contentContainerRef.current) return;
    const matchElements = contentContainerRef.current.querySelectorAll<HTMLElement>('[data-search-match="true"]');
    if (matchElements.length === 0) {
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      onMatchStatsChange?.({ current: 0, total: 0 });
      return;
    }

    const count = matchElements.length;
    const normalizedIndex = ((targetIndex % count) + count) % count;

    // Remove active class from all
    matchElements.forEach((el) => {
      el.classList.remove('search-match-active');
    });

    const activeEl = matchElements[normalizedIndex];
    if (activeEl) {
      activeEl.classList.add('search-match-active');
      if (scrollIntoView) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    setCurrentMatchIndex(normalizedIndex);
    setTotalMatches(count);
    onMatchStatsChange?.({ current: normalizedIndex, total: count });
  };

  const handleNextMatch = () => {
    if (totalMatches <= 0) return;
    jumpToMatchIndex(currentMatchIndex + 1);
  };

  const handlePrevMatch = () => {
    if (totalMatches <= 0) return;
    jumpToMatchIndex(currentMatchIndex - 1);
  };

  useImperativeHandle(ref, () => ({
    nextMatch: handleNextMatch,
    prevMatch: handlePrevMatch,
    jumpToMatch: (idx: number) => jumpToMatchIndex(idx, true),
  }));

  // Re-scan and highlight matches when keyword, tab, raw-text or regulation changes
  useEffect(() => {
    if (!keyword || !keyword.trim()) {
      if (contentContainerRef.current) {
        const matchElements = contentContainerRef.current.querySelectorAll<HTMLElement>('.search-match-active');
        matchElements.forEach((el) => el.classList.remove('search-match-active'));
      }
      setTotalMatches(0);
      setCurrentMatchIndex(0);
      onMatchStatsChange?.({ current: 0, total: 0 });
      return;
    }

    // Small delay to wait for React DOM render
    const timer = setTimeout(() => {
      if (!contentContainerRef.current) return;
      const matchElements = contentContainerRef.current.querySelectorAll<HTMLElement>('[data-search-match="true"]');
      const count = matchElements.length;
      setTotalMatches(count);

      if (count > 0) {
        jumpToMatchIndex(0, true);
      } else {
        setCurrentMatchIndex(0);
        onMatchStatsChange?.({ current: 0, total: 0 });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [keyword, regulation.id, activeTab, showRawText]);

  const handleCopyCitation = (articleTitle: string, articleContent: string) => {
    const textToCopy = `依據「${regulation.title}」${articleTitle}規定：\n「${articleContent.replace(/\n+/g, ' ')}」`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedTitle(articleTitle);
    window.setTimeout(() => setCopiedTitle(null), 2000);
  };

  const fontClass = {
    sm: 'text-[15px] sm:text-[15px] leading-[1.65]',
    md: 'text-[17px] sm:text-[16.5px] leading-[1.75]',
    lg: 'text-[19px] sm:text-[18px] leading-[1.85]',
  }[fontScale];

  const hasSearchMatches = Boolean(keyword.trim() && totalMatches > 0);

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-warm-page px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 relative">
      {/* 1. Ambient Floating Top Progress Line (Fixed right under the top header, 0 extra vertical height) */}
      <div
        className="fixed top-[68px] sm:top-[76px] left-0 right-0 z-30 h-[3px] bg-[#e3dcce]/40 dark:bg-slate-800/60 pointer-events-none no-print transition-colors"
        role="progressbar"
        aria-valuenow={scrollProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="法規閱讀進度"
      >
        <div
          className="h-full bg-gradient-to-r from-[#1b4d82] via-[#2563eb] to-[#0ea5e9] dark:from-blue-500 dark:via-blue-400 dark:to-cyan-300 transition-all duration-150 ease-out shadow-[0_0_8px_rgba(37,99,235,0.4)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Compact Floating Reading Progress Badge (Bottom Left, balanced with ScrollToTop on bottom right) */}
      <button
        type="button"
        onClick={() => {
          const container = scrollContainerRef?.current;
          if (container && container.scrollHeight > container.clientHeight + 4) {
            container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            document.scrollingElement?.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        title={`點擊回到頂端（目前閱讀進度 ${scrollProgress}%）`}
        aria-label={`目前閱讀進度 ${scrollProgress}%，點擊回到頂端`}
        className="fixed bottom-5 left-4 sm:bottom-7 sm:left-7 z-40 no-print flex items-center gap-2 rounded-full border border-[#e3dcce]/90 bg-white/95 px-3 py-1.5 shadow-[0_10px_24px_rgba(70,55,30,0.12)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg active:translate-y-0 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-[0_10px_24px_rgba(0,0,0,0.4)] group"
      >
        {/* Circular Progress SVG */}
        <div className="relative flex h-5 w-5 items-center justify-center flex-shrink-0">
          <svg className="h-5 w-5 -rotate-90 transform" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="2.5"
              fill="transparent"
              className="text-[#e3dcce] dark:text-slate-700"
            />
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={50.265}
              strokeDashoffset={50.265 * (1 - scrollProgress / 100)}
              className="text-[#1b4d82] dark:text-blue-400 transition-all duration-150"
            />
          </svg>
          {scrollProgress === 100 ? (
            <Check className="absolute h-2.5 w-2.5 text-[#1b4d82] dark:text-blue-300 stroke-[3]" />
          ) : (
            <BookOpen className="absolute h-2.5 w-2.5 text-[#1b4d82] dark:text-blue-300" />
          )}
        </div>

        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden xs:inline">
          {scrollProgress === 100 ? '已讀完' : '進度'}
        </span>
        <span className="font-mono text-xs font-black text-[#1b4d82] dark:text-blue-300">
          {scrollProgress}%
        </span>
      </button>

      <div ref={contentContainerRef} className="mx-auto w-full max-w-[860px] space-y-3 sm:space-y-6">
        <section className="surface-card rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#eaf1fb] text-[#1b4d82] dark:bg-blue-950/70 dark:text-blue-300">
                <FileText className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-300 bg-[#eef4fb] px-2.5 py-1 text-[11px] font-extrabold text-[#1b4d82] dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">{regulation.category}</span>
                  <span className="text-[11px] font-medium text-[#7d7768] dark:text-slate-500">{regulation.articles.length} 條／節</span>
                </div>
                <p className="mt-2 hidden max-w-full truncate text-[11px] font-medium text-[#7d7768] dark:text-slate-500 sm:block">來源檔案：{regulation.filename}</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="hidden h-9 flex-shrink-0 items-center gap-1.5 rounded-xl border border-[#e3dcce] px-2.5 text-xs font-bold text-[#7d7768] transition-colors hover:border-blue-300 hover:bg-[#ede6d4] hover:text-[#1b4d82] dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-200 sm:flex no-print"
              title="列印目前法規"
            >
              <Printer className="h-3.5 w-3.5" /> 列印
            </button>
          </div>

          <h1 className="mt-4 text-xl font-black leading-snug tracking-[-0.025em] text-[#1c222b] dark:text-white sm:text-2xl">
            {renderTitleWithHighlights(regulation.title, keyword)}
          </h1>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e3dcce]/80 pt-4 dark:border-slate-800 no-print">
            <button
              onClick={() => setShowRawText((prev) => !prev)}
              className={`min-h-9 rounded-xl border px-3 text-[13px] font-bold transition-all ${showRawText ? 'border-[#1b4d82] bg-[#1b4d82] text-white' : 'border-[#e3dcce] bg-white text-slate-700 hover:border-blue-300 hover:bg-[#ede6d4] hover:text-[#1b4d82] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40'}`}
            >
              {showRawText ? '回到條文排版' : '檢視純文字'}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1 border-b border-[#e3dcce]/80 dark:border-slate-800 no-print">
            <button
              onClick={() => { setActiveTab('articles'); setShowRawText(false); }}
              className={`flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-extrabold transition-colors sm:px-3 ${activeTab === 'articles' ? 'border-[#1b4d82] text-[#1b4d82] dark:border-blue-400 dark:text-blue-200' : 'border-transparent text-[#867f70] hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <ListOrdered className="h-4 w-4" />
              <span>條文全文</span>
              <span className="hidden font-medium text-[#867f70] sm:inline">({regulation.articles.length})</span>
            </button>
            {regulation.attachments && regulation.attachments.length > 0 && (
              <button
                onClick={() => { setActiveTab('attachments'); setShowRawText(false); }}
                className={`flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-extrabold transition-colors sm:px-3 ${activeTab === 'attachments' ? 'border-[#116d5b] text-[#116d5b] dark:border-emerald-400 dark:text-emerald-200' : 'border-transparent text-[#867f70] hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>附件表單</span>
                <span className="hidden font-medium text-[#867f70] sm:inline">({regulation.attachments.length})</span>
              </button>
            )}
          </div>
        </section>

        {showRawText ? (
          <div className="surface-card raw-text-card rounded-[24px] p-4 sm:p-6">
            <RawTextContent
              content={regulation.rawText}
              keyword={keyword}
              fontScale={fontScale}
              lineHeight={lineHeight}
              fontFamily={fontFamily}
            />
          </div>
        ) : activeTab === 'attachments' && regulation.attachments ? (
          <VisualFormViewer attachments={regulation.attachments} />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {regulation.articles.map((article, index) => {
              const matchesKeyword = Boolean(keyword && (
                article.title.toLowerCase().includes(keyword.toLowerCase()) || article.content.toLowerCase().includes(keyword.toLowerCase())
              ));

              return (
                <article
                  key={index}
                  id={`article-${index}`}
                  className={`regulation-article rounded-[22px] border bg-white p-4 transition-all dark:bg-slate-900 sm:rounded-[26px] sm:p-6 ${matchesKeyword ? 'border-[#d49e35] shadow-[0_10px_28px_rgba(212,158,53,0.12)] ring-4 ring-[#d49e35]/15 dark:border-amber-700' : 'border-[#e3dcce] shadow-[0_4px_16px_rgba(60,45,20,0.035)] hover:border-blue-300 dark:border-slate-800 dark:hover:border-slate-700'}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-[#e3dcce]/70 pb-3.5 dark:border-slate-800">
                    <h2 className="flex min-w-0 items-start gap-2.5 text-[15px] font-extrabold leading-relaxed text-[#1b4d82] dark:text-blue-200 sm:text-base">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#1b4d82] ring-4 ring-[#eaf1fb] dark:bg-blue-400 dark:ring-blue-950/70" />
                      <span>{renderTitleWithHighlights(article.title, keyword)}</span>
                    </h2>
                    <button
                      onClick={() => handleCopyCitation(article.title, article.content)}
                      className={`flex h-9 flex-shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[13px] font-bold transition-all ${copiedTitle === article.title ? 'border-[#116d5b] bg-[#116d5b] text-white' : 'border-[#e3dcce] bg-[#faf8f3] text-slate-700 hover:border-blue-300 hover:bg-[#ede6d4] hover:text-[#1b4d82] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40'}`}
                      title="複製公文引述格式"
                    >
                      {copiedTitle === article.title ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-[#1b4d82] dark:text-blue-300" />}
                      <span className="hidden sm:inline">{copiedTitle === article.title ? '已複製' : '複製引述'}</span>
                    </button>
                  </div>
                  <div className="article-text">
                    <FormattedArticleContent content={article.content} keyword={keyword} fontClass={fontClass} lineHeight={lineHeight} fontFamily={fontFamily} />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating In-Viewer Search Match Navigator */}
      {hasSearchMatches && (
        <aside
          aria-label="關鍵字跳轉工具列"
          className="fixed bottom-20 right-4 sm:right-8 z-30 flex items-center gap-1.5 rounded-2xl border border-[#d49e35] bg-white/95 px-3 py-2 text-slate-800 shadow-[0_12px_32px_rgba(212,158,53,0.25)] backdrop-blur-md dark:border-amber-600 dark:bg-slate-900/95 dark:text-slate-100 no-print animate-fadeIn"
        >
          <div className="flex items-center gap-1.5 pr-2 border-r border-[#e3dcce] dark:border-slate-700">
            <Search className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate max-w-[100px] sm:max-w-[160px]">
              「{keyword}」
            </span>
            <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-extrabold text-amber-900 dark:bg-amber-950/80 dark:text-amber-200 whitespace-nowrap">
              {currentMatchIndex + 1} / {totalMatches}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMatch}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e3dcce] bg-[#faf8f3] text-slate-700 transition-colors hover:bg-amber-100 hover:text-amber-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-950/60 dark:hover:text-amber-300"
              title="上一個匹配項目 (Shift + Enter)"
              aria-label="上一個匹配項目"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextMatch}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#e3dcce] bg-[#faf8f3] text-slate-700 transition-colors hover:bg-amber-100 hover:text-amber-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-950/60 dark:hover:text-amber-300"
              title="下一個匹配項目 (Enter)"
              aria-label="下一個匹配項目"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
});

RegulationViewer.displayName = 'RegulationViewer';
