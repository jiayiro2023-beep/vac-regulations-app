import React, { useState, useEffect } from 'react';
import { Regulation } from '../data/regulations';
import { Bookmark } from '../types';
import { VisualFormViewer } from './VisualFormViewer';
import { FormattedArticleContent } from './FormattedArticleContent';
import { 
  Copy, 
  Check, 
  Bookmark as BookmarkIcon, 
  BookmarkCheck, 
  ListOrdered, 
  FileSpreadsheet,
  Type
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
  const [activeTab, setActiveTab] = useState<'articles' | 'attachments'>('articles');

  useEffect(() => {
    setActiveTab('articles');
  }, [regulation.id]);

  const handleCopyCitation = (articleTitle: string, articleContent: string) => {
    const textToCopy = `依據「${regulation.title}」${articleTitle}規定：\n「${articleContent.replace(/\n+/g, ' ')}」`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedTitle(articleTitle);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  const isBookmarked = (articleTitle: string) => {
    return bookmarks.some(b => b.regulationId === regulation.id && b.articleTitle === articleTitle);
  };

  const fontClass = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm leading-relaxed',
    lg: 'text-base leading-relaxed'
  }[fontSize];

  return (
    <div className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-warm-page dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Header Banner */}
        <div className="bg-warm-card dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-warm dark:border-slate-800 shadow-sm space-y-3">
          
          {/* Title Row */}
          <div className="space-y-2">
            <div className="flex items-center flex-wrap gap-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {regulation.category}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
                原檔名: {regulation.filename}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {regulation.title}
            </h1>
          </div>

          {/* Toolbar Row — wraps gracefully on mobile */}
          <div className="flex items-center flex-wrap gap-2 no-print">
            {/* Font size adjuster */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <Type className="w-3.5 h-3.5 text-slate-400 mx-1 hidden sm:block" />
              {(['sm', 'md', 'lg'] as const).map((size, i) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-1 text-xs rounded font-medium ${fontSize === size ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}
                  title={['小字體', '標準字體', '大字體'][i]}
                >
                  {['A-', 'A', 'A+'][i]}
                </button>
              ))}
            </div>

            {/* Toggle raw text */}
            <button
              onClick={() => setShowRawText(!showRawText)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap ${
                showRawText
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {showRawText ? '條文排版模式' : '純文字模式'}
            </button>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'articles'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
              <span>條文全文</span>
              <span className="hidden sm:inline">({regulation.articles.length} 條/節)</span>
            </button>

            {regulation.attachments && regulation.attachments.length > 0 && (
              <button
                onClick={() => setActiveTab('attachments')}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'attachments'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>附件表單</span>
                <span className="hidden sm:inline">({regulation.attachments.length} 份)</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        {showRawText ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed whitespace-pre-wrap dark:text-slate-300">
            {regulation.rawText}
          </div>
        ) : activeTab === 'attachments' && regulation.attachments ? (
          <VisualFormViewer attachments={regulation.attachments} />
        ) : (
          <div className="space-y-3 sm:space-y-4">
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
                  className={`bg-warm-card dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border transition-all duration-200 ${
                    matchesKeyword 
                      ? 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/20 shadow-md' 
                      : 'border-warm dark:border-slate-800 shadow-xs hover:border-amber-200/80 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Article header — stack vertically on mobile */}
                  <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-3 space-y-2">
                    {/* Title line */}
                    <h3 className="text-sm sm:text-base font-bold text-blue-950 dark:text-blue-200 flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 inline-block flex-shrink-0 mt-1" />
                      <span>{article.title}</span>
                    </h3>

                    {/* Action buttons — row, compact on mobile */}
                    <div className="flex items-center gap-2 no-print">
                      {/* Copy citation */}
                      <button
                        onClick={() => handleCopyCitation(article.title, article.content)}
                        className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          copiedTitle === article.title
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        title="複製為符合公文擬辦之標準引述格式"
                      >
                        {copiedTitle === article.title ? (
                          <>
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="hidden sm:inline">已複製公文引述</span>
                            <span className="sm:hidden">已複製</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <span className="hidden sm:inline">複製公文引述</span>
                            <span className="sm:hidden">複製</span>
                          </>
                        )}
                      </button>

                      {/* Bookmark */}
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

                  {/* Article content */}
                  <div className="article-text">
                    <FormattedArticleContent
                      content={article.content}
                      keyword={keyword}
                      fontClass={fontClass}
                    />
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
