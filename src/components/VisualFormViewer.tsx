import React from 'react';
import { Attachment } from '../data/regulations';
import { FileCheck, CheckSquare, Building2, User, FileText, ClipboardList } from 'lucide-react';

interface VisualFormViewerProps {
  attachments: Attachment[];
}

export const VisualFormViewer: React.FC<VisualFormViewerProps> = ({ attachments }) => {
  return (
    <div className="space-y-8">
      {attachments.map((att, idx) => (
        <div 
          key={idx} 
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6"
        >
          {/* Form Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  官方指定申請表單 / 審查表
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {att.title}
                </h3>
              </div>
            </div>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold">
              國軍退除役官兵輔導委員會 官方格式
            </span>
          </div>

          {/* Form Content Visual Card */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700 space-y-4">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <ClipboardList className="w-4 h-4 text-blue-500" />
              <span>表單欄位明細與審查文字全文</span>
            </div>

            <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              {att.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
