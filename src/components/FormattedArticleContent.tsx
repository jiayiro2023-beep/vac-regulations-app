import React, { useMemo } from 'react';
import type { FontFamily, LineHeight } from './ReadingSettings';

interface FormattedArticleContentProps {
  content: string;
  keyword: string;
  fontClass: string;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
}

/**
 * Joins lines that were broken mid-sentence by PDF/OCR extraction.
 * Rules:
 *  - If a line ends with a CJK character (Chinese) and the next line
 *    starts with a CJK character → join (it was wrapped mid-sentence)
 *  - If a line matches a numbered bullet starter (一、二、…) → new block
 *  - If a line is a page-number artifact (pure digit) → discard
 */
function normalizeContent(raw: string): string[] {
  const rawLines = raw.split('\n');
  const merged: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    // Skip pure page numbers (single or double digit isolated lines)
    if (/^\d{1,2}$/.test(line)) continue;
    // Skip empty lines
    if (!line) continue;

    if (merged.length === 0) {
      merged.push(line);
      continue;
    }

    const prev = merged[merged.length - 1];
    const prevLastChar = prev[prev.length - 1];
    const lineFirstChar = line[0];

    const startsNewBlock =
      /^[一二三四五六七八九十百千]+[、.]/.test(line) ||
      /^[（\(][一二三四五六七八九十百千0-9]+[）\)]/.test(line) ||
      /^[1-9]\d*\.\s/.test(line) ||
      /^[◎※附件]/.test(line) ||
      /^第[一二三四五六七八九十百千]+條/.test(line) ||
      /^項次\s*\d+/.test(line) ||
      /^【[^】]+】/.test(line) ||
      /^[•\-*]/.test(line) ||
      '。；！？'.includes(prevLastChar) ||
      '）)'.includes(prevLastChar);

    if (startsNewBlock) {
      merged.push(line);
    } else {
      const prevIsCjkEnd = /[\u4e00-\u9fa5\uff01-\uff5e（）、。；，]$/.test(prev);
      const lineIsCjkStart = /^[\u4e00-\u9fa5\uff01-\uff5e（）、。；，(]/.test(lineFirstChar);

      if (prevIsCjkEnd && lineIsCjkStart) {
        merged[merged.length - 1] = prev + line;
      } else {
        merged.push(line);
      }
    }
  }

  return merged;
}

const FormattedArticleContentView: React.FC<FormattedArticleContentProps> = ({
  content,
  keyword,
  fontClass,
  lineHeight,
  fontFamily,
}) => {
  const lines = useMemo(() => normalizeContent(content), [content]);

  const renderTextWithHighlights = (text: string): React.ReactNode => {
    if (!keyword.trim()) return text;

    const kw = keyword.trim();
    const parts = text.split(new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === kw.toLowerCase() ? (
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

  return (
    <div
      data-reading-line-height={lineHeight}
      data-reading-font-family={fontFamily}
      className={`space-y-3 ${fontClass} break-words min-w-0 text-slate-800 dark:text-slate-300`}
    >

      {lines.map((line, idx) => {
        // Level 1: 一、二、三、… or 1. 2. 3.
        const m1 = line.match(/^([一二三四五六七八九十百千]+[、.]|[1-9]\d*[.、])\s*(.*)/s);
        // Level 2: (一) (二) （一）（二）
        const m2 = line.match(/^([（(][一二三四五六七八九十百千0-9]+[）)])\s*(.*)/s);
        // Level 3: 1. 2. inside a sub-item
        const m3 = line.match(/^([1-9]\d*\.)\s+(.*)/s);
        // Special Section Banner: 【...】
        const mBanner = line.match(/^(【[^】]+】)\s*(.*)/s);
        // Special Item Row: 項次 X
        const mItem = line.match(/^(項次\s*\d+)\s*[:：｜|\s]\s*(.*)/s);
        // Bullet point: • or -
        const mBullet = line.match(/^[•\-*]\s*(.*)/s);

        const isAnnotation = /^◎/.test(line) || /^※/.test(line);

        if (isAnnotation) {
          return (
            <div
              key={idx}
              className="mt-3 border-l-2 border-[#d49e35] bg-[#fdf6e2] py-2 pl-3 text-xs italic leading-relaxed text-[#7d7768] dark:border-amber-700 dark:bg-amber-950/20 dark:text-slate-400"
            >
              {renderTextWithHighlights(line)}
            </div>
          );
        }

        if (mBanner) {
          const [, title, rest] = mBanner;
          return (
            <div
              key={idx}
              className="my-3 rounded-2xl border border-[#c8d8ea] bg-[#eef4fb] p-3.5 shadow-sm dark:border-blue-900/70 dark:bg-blue-950/30"
            >
              <div className="flex items-center gap-2 text-sm font-extrabold text-[#1b4d82] dark:text-blue-200">
                <span>{title}</span>
              </div>
              {rest && (
                <div className="mt-1.5 text-[15px] leading-7 text-slate-800 dark:text-slate-300 sm:text-sm">
                  {renderTextWithHighlights(rest)}
                </div>
              )}
            </div>
          );
        }

        if (mItem) {
          const [, itemTag, rest] = mItem;
          return (
            <div
              key={idx}
              // Stack vertically on mobile, horizontal on sm+
              className="my-2 flex flex-col gap-2 rounded-2xl border border-[#e3dcce] bg-[#faf8f3] p-3.5 transition-all hover:border-blue-300 dark:border-slate-700/70 dark:bg-slate-800/40 dark:hover:border-blue-600 sm:flex-row sm:items-start"
            >
              <span className="w-fit flex-shrink-0 rounded-lg bg-[#1b4d82] px-2.5 py-1 text-xs font-extrabold tracking-wide text-white shadow-sm dark:bg-blue-500">
                {itemTag}
              </span>
              <div className="flex-1 text-[16px] font-medium leading-7 text-slate-800 dark:text-slate-200 sm:text-[15px]">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        if (mBullet) {
          const [, rest] = mBullet;
          return (
            <div
              key={idx}
              className="flex items-start gap-2 py-1 pl-2 text-[16px] leading-7 text-slate-800 dark:text-slate-300 sm:pl-4 sm:text-[15px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#1b4d82] dark:bg-blue-400 flex-shrink-0 mt-2" />
              <div className="flex-1 leading-relaxed">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        if (m1) {
          const [, num, rest] = m1;
          return (
            <div
              key={idx}
              className="my-1 flex items-start gap-2 rounded-2xl border border-[#c8d8ea]/80 bg-[#edf3fb]/60 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/50 sm:gap-2.5"
            >
              <span className="mt-0.5 min-w-[1.75rem] flex-shrink-0 rounded-lg border border-[#c8d8ea] bg-[#e1ecfa] px-1 py-0.5 text-center text-xs font-extrabold text-[#1b4d82] dark:border-blue-800 dark:bg-blue-900/60 dark:text-blue-200 sm:min-w-[2rem] sm:px-1.5">
                {num}
              </span>
              <div className="flex-1 text-slate-800 dark:text-slate-200 leading-relaxed">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        if (m2) {
          const [, num, rest] = m2;
          return (
            <div
              key={idx}
              className="my-1 flex items-start gap-2 border-l-2 border-[#8172c7] py-1.5 pl-3 pr-2 text-slate-800 dark:border-indigo-600 dark:text-slate-300 sm:pl-6"
            >
              <span className="flex-shrink-0 font-bold text-[#5243aa] dark:text-indigo-400 text-xs mt-0.5">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        if (m3) {
          const [, num, rest] = m3;
          return (
            <div
              key={idx}
              className="my-1 flex items-start gap-2 py-1 pl-5 pr-2 text-sm text-[#5f594d] dark:text-slate-400 sm:pl-10 sm:text-[13px]"
            >
              <span className="flex-shrink-0 font-semibold text-[#7d7768] dark:text-slate-400">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={idx} className="break-words py-0.5 leading-8 text-slate-800 dark:text-slate-300">
            {renderTextWithHighlights(line)}
          </p>
        );
      })}
    </div>
  );
};

export const FormattedArticleContent = React.memo(FormattedArticleContentView);
