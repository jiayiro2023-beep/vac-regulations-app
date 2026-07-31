import React, { useState } from 'react';
import { Regulation } from '../data/regulations';
import { Bookmark } from '../types';
import { 
  Copy, 
  Check, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck, 
  FileText, 
  ListOrdered, 
  Download, 
  Share2, 
  Info,
  Type,
  Maximize2,
  Minimize2,
  Layers
} from 'lucide-react';

interface RegulationViewerProps {
  regulation: Regulation;
  keyword: string;
  bookmarks: Bookmark[];
  onToggleBookmark: (regId: string, articleTitle: string) => void;
}

export const RegulationViewer: React.FC<RegulationViewerProps> = ({
  regulation,
  keyword,
  bookmarks,
  onToggleBookmark
}) => {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showRawText, setShowRawText] = useState(false);

  const handleCopyCitation = (articleTitle: string, articleContent: string) => {
    const textToCopy = `依據「${regulation.title}」${articleTitle}規定：\n「${articleContent.replace(/\n+/g, ' ')}」`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTitle(articleTitle);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const isBookmarked = (articleTitle: string) => {
    return bookmarks.some(b => b.regulationId === regulation.id && b.articleTitle === articleTitle);
  };

  // Helper to highlight matching keywords
  const renderHighlightedText = (text: string) => {
    if (!keyword.trim()) return text;

    const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === keyword.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-800 dark:text-amber-100 text-amber-900 font-bold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const fontClass = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed'
  }[fontSize];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {regulation.category}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  檔案來源: {regulation.filename}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {regulation.title}
              </h1>
            </div>

            {/* View options */}
            <div className="flex items-center space-x-2 no-print">
              {/* Font size adjuster */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 text-xs rounded font-medium ${fontSize === 'sm' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                  title="小字體"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('md')}
                  className={`px-2 py-1 text-xs rounded font-medium ${fontSize === 'md' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                  title="標準字體"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 text-xs rounded font-medium ${fontSize === 'lg' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                  title="大字體"
                >
                  A+
                </button>
              </div>

              {/* Toggle raw text mode */}
              <button
                onClick={() => setShowRawText(!showRawText)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  showRawText
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {showRawText ? '切換條文檢視' : '檢視全文純文字'}
              </button>
            </div>
          </div>

          {/* Article Quick Jump Chips */}
          {!showRawText && regulation.articles.length > 1 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1">
                <ListOrdered className="w-3.5 h-3.5" /> 條文導覽 (共 {regulation.articles.length} 條/節)：
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {regulation.articles.map((art, idx) => (
                  <a
                    key={idx}
                    href={`#article-${idx}`}
                    className="px-2 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    {art.title.split('\n')[0].substring(0, 15)}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        {showRawText ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap dark:text-slate-300">
            {renderHighlightedText(regulation.rawText)}
          </div>
        ) : (
          <div className="space-y-4">
            {regulation.articles.map((article, idx) => {
              const bookmarked = isBookmarked(article.title);
              const matchesKeyword = keyword && (
                article.title.toLowerCase().includes(keyword.toLowerCase()) ||
                article.content.toLowerCase().includes(keyword.toLowerCase())
              );

              return (
                <div
                  key={idx}
                  id={`article-${idx}`}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border transition-all duration-200 ${
                    matchesKeyword 
                      ? 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/20 shadow-md' 
                      : 'border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-3">
                    <h3 className="text-base font-bold text-blue-950 dark:text-blue-200 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 inline-block"></span>
                      <span>{renderHighlightedText(article.title)}</span>
                    </h3>

                    {/* Article actions */}
                    <div className="flex items-center space-x-2 no-print flex-shrink-0">
                      {/* One-click citation copy */}
                      <button
                        onClick={() => handleCopyCitation(article.title, article.content)}
                        className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          copiedTitle === article.title
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title="複製為符合公文擬辦之標準引述格式"
                      >
                        {copiedTitle === article.title ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>已複製公文引述</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                            <span>複製公文引述</span>
                          </>
                        )}
                      </button>

                      {/* Bookmark button */}
                      <button
                        onClick={() => onToggleBookmark(regulation.id, article.title)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          bookmarked
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                        }`}
                        title={bookmarked ? "移除書籤" : "加入書籤"}
                      >
                        {bookmarked ? <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-500" /> : <BookmarkIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className={`whitespace-pre-wrap text-slate-700 dark:text-slate-300 ${fontClass}`}>
                    {renderHighlightedText(article.content)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
