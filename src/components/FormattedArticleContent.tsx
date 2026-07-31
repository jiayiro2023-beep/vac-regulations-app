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

    // Starts a new paragraph if:
    //  1. Current line starts with a numbered bullet (一、二、 etc.)
    //  2. Current line starts with (一) (二) etc.
    //  3. Previous line ended with "：" "。" "；" "！" "？" ")" "）"
    //  4. Current line starts with "第" (new article reference)
    //  5. Current line starts with "◎" "※" "附件"
    //  6. Prev line ended in digit + "元" or "月"
    const startsNewBlock =
      /^[一二三四五六七八九十百千]+[、.]/.test(line) ||
      /^[（\(][一二三四五六七八九十百千0-9]+[）\)]/.test(line) ||
      /^[1-9]\d*\.\s/.test(line) ||     // "1. ", "2. "
      /^[◎※附件]/.test(line) ||
      /^第[一二三四五六七八九十百千]+條/.test(line) ||
      '。；！？'.includes(prevLastChar) ||
      '）)'.includes(prevLastChar);

    if (startsNewBlock) {
      merged.push(line);
    } else {
      // Check if we should join: prev ends in CJK / letter, next starts in CJK
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
    <div className={`space-y-1.5 ${fontClass}`}>
      {lines.map((line, idx) => {
        // Level 1: 一、二、三、… or 1. 2. 3.
        const m1 = line.match(/^([一二三四五六七八九十百千]+[、.]|[1-9]\d*[.、])\s*(.*)/s);
        // Level 2: (一) (二) （一）（二）
        const m2 = line.match(/^([（(][一二三四五六七八九十百千0-9]+[）)])\s*(.*)/s);
        // Level 3: 1. 2. inside a sub-item (Arabic numerals under (一))
        const m3 = line.match(/^([1-9]\d*\.)\s+(.*)/s);
        // Section header line: 前項、本條 etc. short standalone statement
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

        if (m1) {
          const [, num, rest] = m1;
          return (
            <div
              key={idx}
              className="flex items-start gap-2.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 my-1"
            >
              <span className="flex-shrink-0 mt-0.5 min-w-[2rem] text-center px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-xs border border-blue-200 dark:border-blue-800">
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
              className="flex items-start gap-2 pl-6 pr-2 py-1.5 my-0.5 border-l-2 border-indigo-300 dark:border-indigo-600 text-slate-700 dark:text-slate-300"
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
              className="flex items-start gap-2 pl-10 pr-2 py-1 my-0.5 text-slate-600 dark:text-slate-400 text-xs"
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
          <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300">
            {renderTextWithHighlights(line)}
          </p>
        );
      })}
    </div>
  );
};
