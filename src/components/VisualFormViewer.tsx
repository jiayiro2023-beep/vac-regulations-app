import React from 'react';
import { Attachment } from '../data/regulations';
import { OfficialFormContainer } from './OfficialForms';
import { FileCheck, ClipboardList, Printer } from 'lucide-react';

interface VisualFormViewerProps {
  attachments: Attachment[];
}

export const VisualFormViewer: React.FC<VisualFormViewerProps> = ({ attachments }) => {
  return (
    <div className="space-y-8">
      {attachments.map((att, idx) => {
        let formType: 'training_备案' | 'training_補助' | 'training_全額' | 'family_切結' | 'stability_說明' = 'training_备案';
        if (att.title.includes("附件二") || att.title.includes("補助金")) {
          formType = 'training_補助';
        } else if (att.title.includes("附件三") || att.title.includes("全額")) {
          formType = 'training_全額';
        } else if (att.title.includes("切結") || att.title.includes("眷屬")) {
          formType = 'family_切結';
        }

        return (
          <div 
            key={idx} 
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6"
          >
            {/* Header with Print action */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    官方申辦表單與審查表格具象化
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {att.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>列印申辦表格</span>
              </button>
            </div>

            {/* Render Visual Government Official Form Grid */}
            <OfficialFormContainer formType={formType} />

            {/* Original Full Text Detail Box */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700 space-y-3">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ClipboardList className="w-4 h-4 text-blue-500" />
                <span>原始表單條項與檢附須知全文</span>
              </div>
              <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {att.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
