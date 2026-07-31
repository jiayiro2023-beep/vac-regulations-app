import React from 'react';

interface FormattedArticleContentProps {
  content: string;
  keyword: string;
  fontClass: string;
}

export const FormattedArticleContent: React.FC<FormattedArticleContentProps> = ({
  content,
  keyword,
  fontClass
}) => {
  // Split content into structured blocks (paragraphs vs items)
  const lines = content.split('\n').map(l => l.strip ? l.strip() : l.trim()).filter(Boolean);

  const renderTextWithHighlights = (text: string) => {
    if (!text) return null;

    // Highlight key monetary values, dates, and search keywords
    let elements: (string | JSX.Element)[] = [text];

    // 1. Search keyword highlight
    if (keyword.trim()) {
      const kw = keyword.trim();
      const nextElements: (string | JSX.Element)[] = [];
      elements.forEach(part => {
        if (typeof part === 'string') {
          const subParts = part.split(new RegExp(`(${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
          subParts.forEach((sp, i) => {
            if (sp.toLowerCase() === kw.toLowerCase()) {
              nextElements.push(
                <mark key={`kw-${i}`} className="bg-amber-200 dark:bg-amber-800 dark:text-amber-100 text-amber-900 font-bold px-1 rounded shadow-xs">
                  {sp}
                </mark>
              );
            } else {
              nextElements.push(sp);
            }
          });
        } else {
          nextElements.push(part);
        }
      });
      elements = nextElements;
    }

    return elements;
  };

  return (
    <div className={`space-y-3 ${fontClass}`}>
      {lines.map((line, idx) => {
        // Level 1 Bullet: 一、, 二、, 三、, 四、, 五、, 六、, 七、, 八、, 九、, 十、
        const m1 = line.match(/^([一二三四五六七八九十百0-9]+\s*[、\.])\s*(.*)/);
        // Level 2 Bullet: (一), (二), （一）, （二）, (1), (2)
        const m2 = line.match(/^([（\(][一二三四五六七八九十0-9]+[）\)])\s*(.*)/);

        if (m1) {
          const num = m1[1];
          const rest = m1[2];
          return (
            <div 
              key={idx} 
              className="flex items-start space-x-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 my-1.5 transition-colors hover:bg-blue-50/40 dark:hover:bg-blue-950/20"
            >
              <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold text-xs border border-blue-200 dark:border-blue-800">
                {num}
              </span>
              <div className="flex-1 text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        if (m2) {
          const num = m2[1];
          const rest = m2[2];
          return (
            <div 
              key={idx} 
              className="flex items-start space-x-2 pl-4 sm:pl-6 pr-2 py-1.5 my-1 border-l-2 border-indigo-400 dark:border-indigo-500 text-slate-700 dark:text-slate-300"
            >
              <span className="flex-shrink-0 font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                {num}
              </span>
              <div className="flex-1 leading-relaxed">
                {renderTextWithHighlights(rest)}
              </div>
            </div>
          );
        }

        // Regular paragraph text
        return (
          <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 my-1.5">
            {renderTextWithHighlights(line)}
          </p>
        );
      })}
    </div>
  );
};
