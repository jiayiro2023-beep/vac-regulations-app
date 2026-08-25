import { Attachment } from '../data/regulations';
import { OfficialFormContainer, FormType } from './OfficialForms';
import { FileCheck, ClipboardList, Printer, ChevronDown } from 'lucide-react';

interface VisualFormViewerProps {
  attachments: Attachment[];
}

function detectFormType(title: string): FormType {
  if (title.includes('就學補助') || title.includes('核發金額') || title.includes('金額表')) return 'edu_allowance_table';
  if (title.includes('備案') || title.includes('附件一') || title.includes('附件 一')) return 'training_备案';
  if (title.includes('甲表') || title.includes('附件二') || title.includes('附件 二') || (title.includes('補助') && !title.includes('全額') && !title.includes('乙表'))) return 'training_補助';
  if (title.includes('乙表') || title.includes('全額') || title.includes('附件三') || title.includes('附件 三')) return 'training_全額';
  if (title.includes('切結') || title.includes('眷屬')) return 'family_切結';
  return 'generic';
}

export const VisualFormViewer: React.FC<VisualFormViewerProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="surface-card rounded-[24px] p-8 text-center text-sm text-slate-500 dark:text-slate-400">
        此法規文件無具象化附件表單，請點擊上方「條文全文」標籤檢視內容。
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-7">
      {attachments.map((attachment, index) => {
        const formType = detectFormType(attachment.title);
        return (
          <section key={index} className="surface-card overflow-hidden rounded-[24px] sm:rounded-[28px]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"><FileCheck className="h-5 w-5" /></span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">Official attachment</p>
                  <h2 className="mt-1 text-sm font-extrabold leading-snug text-slate-900 dark:text-white">{attachment.title}</h2>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200"
              >
                <Printer className="h-3.5 w-3.5" /> 列印
              </button>
            </div>

            <div className="official-form-scroll px-3 py-4 sm:px-6 sm:py-6">
              <OfficialFormContainer formType={formType} rawTitle={attachment.title} rawContent={attachment.content} />
            </div>

            <details className="group border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-6">
              <summary className="flex cursor-pointer select-none items-center gap-2 text-xs font-bold text-slate-500 transition-colors hover:text-blue-700 dark:text-slate-400 dark:hover:text-blue-300">
                <ClipboardList className="h-4 w-4 text-blue-500" />
                <span>展開原始條項全文對照</span>
                <ChevronDown className="ml-auto h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 whitespace-pre-wrap break-words rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200">{attachment.content}</div>
            </details>
          </section>
        );
      })}
    </div>
  );
};
