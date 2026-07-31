import React from 'react';
import { Attachment } from '../data/regulations';
import { OfficialFormContainer, FormType } from './OfficialForms';
import { FileCheck, ClipboardList, Printer } from 'lucide-react';

interface VisualFormViewerProps {
  attachments: Attachment[];
}

function detectFormType(title: string): FormType {
  const t = title;
  if (t.includes('就學補助') || t.includes('核發金額') || t.includes('金額表')) {
    return 'edu_allowance_table';
  }
  if (t.includes('備案') || t.includes('附件一') || t.includes('附件 一')) {
    return 'training_备案';
  }
  if (
    t.includes('甲表') ||
    t.includes('附件二') ||
    t.includes('附件 二') ||
    (t.includes('補助') && !t.includes('全額') && !t.includes('乙表'))
  ) {
    return 'training_補助';
  }
  if (
    t.includes('乙表') ||
    t.includes('全額') ||
    t.includes('附件三') ||
    t.includes('附件 三')
  ) {
    return 'training_全額';
  }
  if (t.includes('切結') || t.includes('眷屬')) {
    return 'family_切結';
  }
  return 'generic';
}

export const VisualFormViewer: React.FC<VisualFormViewerProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center text-slate-500">
        此法規文件無具象化附件表單，請點擊上方「條文全文」標籤檢視內容。
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {attachments.map((att, idx) => {
        const formType = detectFormType(att.title);

        return (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6"
          >
            {/* Card header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    具象化官方公文申辦表單
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {att.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>列印</span>
              </button>
            </div>

            {/* Official form grid */}
            <OfficialFormContainer
              formType={formType}
              rawTitle={att.title}
              rawContent={att.content}
            />

            {/* Raw text reference */}
            <details className="group">
              <summary className="cursor-pointer select-none text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span>展開原始條項全文對照</span>
              </summary>
              <div className="mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                {att.content}
              </div>
            </details>
          </div>
        );
      })}
    </div>
  );
};
