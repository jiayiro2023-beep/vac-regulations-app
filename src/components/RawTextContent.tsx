import React, { useMemo } from 'react';
import type { FontFamily, FontScale, LineHeight } from './ReadingSettings';

interface RawTextContentProps {
  content: string;
  fontScale: FontScale;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
}

type TextBlock = {
  text: string;
  kind: 'paragraph' | 'heading' | 'annotation' | 'row' | 'article' | 'list';
  marker?: string;
};

const STRUCTURED_LINE = /^(?:第[一二三四五六七八九十百千萬]+條|[一二三四五六七八九十百千萬]+[、．.]|[（(][一二三四五六七八九十百千萬0-9]+[）)]|[1-9]\d*[.、]|[◎※]|附件|主旨[：:]|依據[：:]|公告事項[：:]|公發布日[：:]|修正日期[：:]|發文字號[：:]|法規體系[：:]|項次|就學地點|核發金額|訓練職類|行業分類|職務說明|相關條文|問題|說明)/;
const STANDALONE_HEADING = /^第[一二三四五六七八九十百千萬]+條$/;
const SENTENCE_END = /[。！？；：:）》)」』】]$/;
const TABLE_MARKERS = ['項次', '訓練職類', '行業分類', '職務說明', '核發金額', '就學地點', '相關條文'];
const FORM_SECTION = /^(?:申請資訊|聯絡方式|職訓課程資料|應載明事項|應檢附資料|審核結果|就業現況)/;

function cleanLine(line: string): string {
  return line
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function collapseCjkFragments(lines: string[]): string[] {
  const collapsed: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line || !/^[\u3400-\u9fff\uff00-\uffef]{1,2}$/.test(line)) {
      collapsed.push(line);
      continue;
    }

    let merged = line;
    while (index + 1 < lines.length && /^[\u3400-\u9fff\uff00-\uffef]{1,2}$/.test(lines[index + 1])) {
      merged += lines[index + 1];
      index += 1;
    }
    collapsed.push(merged);
  }

  return collapsed;
}

function getCleanLines(content: string): string[] {
  const lines = content
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(cleanLine);
  return collapseCjkFragments(lines);
}

function isTableLike(lines: string[]): boolean {
  const sample = lines.slice(0, 80).filter(Boolean);
  const markerCount = TABLE_MARKERS.reduce((count, marker) => count + (sample.some((line) => line.includes(marker)) ? 1 : 0), 0);
  const shortLineRatio = sample.length > 0
    ? sample.filter((line) => [...line].length <= 14).length / sample.length
    : 0;

  // PDF tables usually expose column headings and many short, one-cell lines.
  return markerCount >= 2 || (lines.length >= 120 && shortLineRatio >= 0.68);
}

function joinFragments(previous: string, next: string): string {
  // CJK extraction does not need a space between a wrapped pair of characters.
  if (/^[\u3400-\u9fff\uff00-\uffef]/.test(next) && /[\u3400-\u9fff\uff00-\uffef）】」』]$/.test(previous)) {
    return `${previous}${next}`;
  }
  return `${previous} ${next}`.replace(/ +/g, ' ');
}

function normalizeDocument(content: string): TextBlock[] {
  const lines = getCleanLines(content);
  const nonEmpty = lines.filter(Boolean);
  if (isTableLike(nonEmpty)) {
    return lines
      .map((text): TextBlock => ({
        text,
        kind: /^[◎※]/.test(text) ? 'annotation' : 'row',
      }))
      .filter((block) => block.text || block.kind === 'annotation');
  }

  const documentLines = lines.filter((line) => !/^\d{1,2}$/.test(line));
  const blocks: TextBlock[] = [];
  let current = '';
  let inForm = false;

  const flush = () => {
    if (!current) return;
    const isAnnotation = /^[◎※]/.test(current);
    const articleMatch = current.match(/^(第[一二三四五六七八九十百千萬]+條)(.*)$/s);
    const listMatch = current.match(/^([一二三四五六七八九十百千萬]+[、．.]|[（(][一二三四五六七八九十百千萬0-9]+[）)])\s*(.*)$/s);
    const isHeading =
      blocks.length === 0 ||
      STANDALONE_HEADING.test(current) ||
      /^(?:附件[一二三]?|主旨[：:]|依據[：:]|公告事項[：:]|公發布日[：:]|修正日期[：:]|發文字號[：:]|法規體系[：:])/.test(current);

    if (articleMatch) {
      blocks.push({ text: articleMatch[1], kind: 'article' });
      if (articleMatch[2]) blocks.push({ text: articleMatch[2], kind: 'paragraph' });
    } else if (listMatch) {
      blocks.push({ text: listMatch[2], marker: listMatch[1], kind: 'list' });
    } else {
      blocks.push({ text: current, kind: isAnnotation ? 'annotation' : isHeading ? 'heading' : 'paragraph' });
    }
    current = '';
  };

  for (const line of documentLines) {
    if (!line) {
      flush();
      continue;
    }

    if (/^附件[一二三]?/.test(line)) {
      flush();
      inForm = true;
      blocks.push({ text: line, kind: 'heading' });
      continue;
    }

    if (inForm) {
      flush();
      blocks.push({
        text: line,
        kind: FORM_SECTION.test(line) ? 'heading' : /^[◎※]/.test(line) ? 'annotation' : 'row',
      });
      continue;
    }

    const startsNewBlock =
      !current ||
      STRUCTURED_LINE.test(line) ||
      SENTENCE_END.test(current) ||
      STANDALONE_HEADING.test(current);

    if (startsNewBlock) {
      flush();
      current = line;
    } else {
      current = joinFragments(current, line);
    }
  }
  flush();
  return blocks;
}

const RawTextContentView: React.FC<RawTextContentProps> = ({ content, fontScale, lineHeight, fontFamily }) => {
  const cleanLines = useMemo(() => getCleanLines(content), [content]);
  const tableLike = useMemo(() => isTableLike(cleanLines.filter(Boolean)), [cleanLines]);
  const blocks = useMemo(() => normalizeDocument(content), [content]);
  const scaleClass = {
    sm: 'text-[16px] sm:text-[16px]',
    md: 'text-[17px] sm:text-[17px]',
    lg: 'text-[19px] sm:text-[19px]',
  }[fontScale];

  return (
    <div
      data-reading-line-height={lineHeight}
      data-reading-font-family={fontFamily}
      className={`raw-text-content min-w-0 ${scaleClass} text-slate-700 dark:text-slate-300`}
    >
      <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-3.5 py-3 text-sm leading-relaxed text-blue-900 dark:border-blue-900/70 dark:bg-blue-950/30 dark:text-blue-100 sm:px-4">
        純文字閱讀版已依手機閱讀需求重整斷行；表格型資料依原始文字順序逐列呈現。
      </div>

      {tableLike ? (
        <div className="raw-text-table-flow" aria-label="純文字資料">
          {blocks.map((block, index) => block.text ? (
            <div
              key={`${index}-${block.text.slice(0, 12)}`}
              className={`raw-text-table-row ${block.kind === 'annotation' ? 'raw-text-table-row--annotation' : ''}`}
            >
              {block.text}
            </div>
          ) : <div key={`gap-${index}`} className="h-2" aria-hidden="true" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => {
            if (block.kind === 'annotation') {
              return (
                <p key={`${index}-${block.text.slice(0, 12)}`} className="raw-text-annotation">
                  {block.text}
                </p>
              );
            }

            if (block.kind === 'heading') {
              return (
                <p key={`${index}-${block.text.slice(0, 12)}`} className="raw-text-heading">
                  {block.text}
                </p>
              );
            }

            if (block.kind === 'article') {
              return (
                <div key={`${index}-${block.text}`} className="raw-text-article-row">
                  <span className="raw-text-article-marker">{block.text}</span>
                </div>
              );
            }

            if (block.kind === 'list') {
              return (
                <div key={`${index}-${block.marker}-${block.text.slice(0, 12)}`} className="raw-text-list-row">
                  <span className="raw-text-list-marker">{block.marker}</span>
                  <span className="min-w-0 flex-1">{block.text}</span>
                </div>
              );
            }

            if (block.kind === 'row') {
              return (
                <div key={`${index}-${block.text.slice(0, 12)}`} className="raw-text-form-row">
                  {block.text}
                </div>
              );
            }

            return (
              <p key={`${index}-${block.text.slice(0, 12)}`} className="raw-text-paragraph">
                {block.text}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const RawTextContent = React.memo(RawTextContentView);
