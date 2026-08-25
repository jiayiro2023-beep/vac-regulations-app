import { useEffect, useLayoutEffect, useState } from 'react';
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
} from 'lucide-react';

interface RegulationViewerProps {
  regulation: Regulation;
  keyword: string;
  fontScale: FontScale;
  lineHeight: LineHeight;
  fontFamily: FontFamily;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
}

export const RegulationViewer: React.FC<RegulationViewerProps> = ({ regulation, keyword, fontScale, lineHeight, fontFamily, scrollContainerRef }) => {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [showRawText, setShowRawText] = useState(false);
  const [activeTab, setActiveTab] = useState<'articles' | 'attachments'>('articles');

  useEffect(() => {
    setActiveTab('articles');
    setShowRawText(false);
  }, [regulation.id]);

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

  const handleCopyCitation = (articleTitle: string, articleContent: string) => {
    const textToCopy = `依據「${regulation.title}」${articleTitle}規定：\n「${articleContent.replace(/\n+/g, ' ')}」`;
    navigator.clipboard?.writeText(textToCopy);
    setCopiedTitle(articleTitle);
    window.setTimeout(() => setCopiedTitle(null), 2000);
  };

  const fontClass = {
    sm: 'text-[16px] sm:text-[16px] leading-[1.95]',
    md: 'text-[18px] sm:text-[17px] leading-[2.05]',
    lg: 'text-[20px] sm:text-[19px] leading-[2.15]',
  }[fontScale];

  return (
    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto bg-warm-page px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-[860px] space-y-4 sm:space-y-6">
        <section className="surface-card rounded-[24px] p-4 sm:rounded-[28px] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"><FileText className="h-4 w-4" /></span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200">{regulation.category}</span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{regulation.articles.length} 條／節</span>
                </div>
                <p className="mt-2 hidden max-w-full truncate text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:block">來源檔案：{regulation.filename}</p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="hidden h-9 flex-shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 text-xs font-bold text-slate-500 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/50 dark:hover:text-blue-200 sm:flex no-print"
              title="列印目前法規"
            >
              <Printer className="h-3.5 w-3.5" /> 列印
            </button>
          </div>

          <h1 className="mt-4 text-xl font-black leading-snug tracking-[-0.025em] text-slate-900 dark:text-white sm:text-2xl">{regulation.title}</h1>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 dark:border-slate-800 no-print">
            <button
              onClick={() => setShowRawText((prev) => !prev)}
              className={`min-h-9 rounded-xl border px-3 text-[13px] font-bold transition-all ${showRawText ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40'}`}
            >
              {showRawText ? '回到條文排版' : '檢視純文字'}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 no-print">
            <button
              onClick={() => { setActiveTab('articles'); setShowRawText(false); }}
              className={`flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-extrabold transition-colors sm:px-3 ${activeTab === 'articles' ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-200' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
            >
              <ListOrdered className="h-4 w-4" />
              <span>條文全文</span>
              <span className="hidden font-medium text-slate-400 sm:inline">({regulation.articles.length})</span>
            </button>
            {regulation.attachments && regulation.attachments.length > 0 && (
              <button
                onClick={() => { setActiveTab('attachments'); setShowRawText(false); }}
                className={`flex min-h-10 items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-extrabold transition-colors sm:px-3 ${activeTab === 'attachments' ? 'border-emerald-600 text-emerald-700 dark:border-emerald-400 dark:text-emerald-200' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>附件表單</span>
                <span className="hidden font-medium text-slate-400 sm:inline">({regulation.attachments.length})</span>
              </button>
            )}
          </div>
        </section>

        {showRawText ? (
          <div className="surface-card raw-text-card rounded-[24px] p-4 sm:p-6">
            <RawTextContent
              content={regulation.rawText}
              fontScale={fontScale}
              lineHeight={lineHeight}
              fontFamily={fontFamily}
            />
          </div>
        ) : activeTab === 'attachments' && regulation.attachments ? (
          <VisualFormViewer attachments={regulation.attachments} />
        ) : (
          <div className="space-y-4">
            {regulation.articles.map((article, index) => {
              const matchesKeyword = Boolean(keyword && (
                article.title.toLowerCase().includes(keyword.toLowerCase()) || article.content.toLowerCase().includes(keyword.toLowerCase())
              ));

              return (
                <article
                  key={index}
                  id={`article-${index}`}
                  className={`regulation-article rounded-[22px] border bg-white p-4 transition-all dark:bg-slate-900 sm:rounded-[26px] sm:p-6 ${matchesKeyword ? 'border-amber-300 shadow-[0_10px_28px_rgba(214,158,46,0.12)] ring-4 ring-amber-400/10 dark:border-amber-700' : 'border-slate-200/90 shadow-[0_8px_22px_rgba(31,65,102,0.04)] hover:border-blue-200 dark:border-slate-800 dark:hover:border-slate-700'}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800">
                    <h2 className="flex min-w-0 items-start gap-2.5 text-[15px] font-extrabold leading-relaxed text-[#173e68] dark:text-blue-200 sm:text-base">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:bg-blue-400 dark:ring-blue-950/70" />
                      <span>{article.title}</span>
                    </h2>
                    <button
                      onClick={() => handleCopyCitation(article.title, article.content)}
                      className={`flex h-9 flex-shrink-0 items-center gap-1.5 rounded-xl border px-2.5 text-[13px] font-bold transition-all ${copiedTitle === article.title ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40'}`}
                      title="複製公文引述格式"
                    >
                      {copiedTitle === article.title ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />}
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
    </div>
  );
};
