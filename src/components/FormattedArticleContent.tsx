import React from 'react';

interface FormattedArticleContentProps {
  content: string;
  keyword: string;
  fontClass: string;
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

export const FormattedArticleContent: React.FC<FormattedArticleContentProps> = ({
  content,
  keyword,
  fontClass,
}) => {
  const lines = normalizeContent(content);

  const renderTextWithHighlights = (text: string): React.ReactNode => {
    if (!keyword.trim()) return text;

    const kw = keyword.trim();
    const parts = text.split(new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === kw.toLowerCase() ? (
        <mark
          key={i}
          className="bg-amber-200 dark:bg-amber-700/70 dark:text-amber-100 text-amber-900 font-bold px-0.5 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`space-y-2 ${fontClass} break-words min-w-0`}>
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
              className="text-xs text-slate-500 dark:text-slate-400 italic border-t border-dashed border-slate-200 dark:border-slate-700 pt-2 mt-2"
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
              className="mt-3 mb-2 p-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-slate-50 dark:from-slate-800 dark:to-slate-800/60 border-l-4 border-blue-600 dark:border-blue-400 shadow-xs"
            >
              <div className="font-bold text-blue-900 dark:text-blue-300 text-sm flex items-center space-x-2">
                <span>{title}</span>
              </div>
              {rest && (
                <div className="mt-1 text-slate-700 dark:text-slate-300 text-sm sm:text-xs">
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
              className="flex flex-col sm:flex-row sm:items-start gap-2 p-3 my-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 transition-all shadow-xs"
            >
              <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-blue-600 text-white dark:bg-blue-500 font-extrabold text-xs tracking-wide shadow-xs w-fit">
                {itemTag}
              </span>
              <div className="flex-1 text-slate-800 dark:text-slate-200 font-medium leading-relaxed text-sm">
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
              className="flex items-start gap-2 pl-2 sm:pl-4 py-1 text-slate-700 dark:text-slate-300 text-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0 mt-2" />
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
              className="flex items-start gap-2 sm:gap-2.5 py-2 px-2.5 sm:px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 my-1"
            >
              <span className="flex-shrink-0 mt-0.5 min-w-[1.75rem] sm:min-w-[2rem] text-center px-1 sm:px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-xs border border-blue-200 dark:border-blue-800">
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
              className="flex items-start gap-2 pl-3 sm:pl-6 pr-2 py-1.5 my-0.5 border-l-2 border-indigo-300 dark:border-indigo-600 text-slate-700 dark:text-slate-300"
            >
              <span className="flex-shrink-0 font-bold text-indigo-600 dark:text-indigo-400 text-xs mt-0.5">
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
              className="flex items-start gap-2 pl-5 sm:pl-10 pr-2 py-1 my-0.5 text-slate-650 dark:text-slate-400 text-sm sm:text-xs"
            >
              <span className="flex-shrink-0 font-semibold text-slate-500 dark:text-slate-400">
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
          <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 py-0.5 break-words">
            {renderTextWithHighlights(line)}
          </p>
        );
      })}
    </div>
  );
};
