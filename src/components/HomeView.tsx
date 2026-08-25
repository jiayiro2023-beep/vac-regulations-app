import {
  Briefcase,
  Award,
  GraduationCap,
  FolderCheck,
  Search,
  Calculator,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface HomeViewProps {
  onSelectRegulation: (id: string) => void;
  onOpenCalculator: () => void;
  regulationCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectRegulation,
  onOpenCalculator,
  regulationCount,
}) => {
  const quickLinks = [
    {
      title: '穩定就業津貼作業說明',
      desc: '第一類與第二類退除役官兵穩定就業津貼核發標準',
      id: '促進退除役官兵穩定就業津貼發給辦法作業說明_114.12.24修訂___1__pdf',
      icon: Briefcase,
      tone: 'blue',
    },
    {
      title: '職業訓練補助辦法',
      desc: '榮民及第二類退除役官兵職業訓練補助次數與參照表',
      id: '_國軍退除役官兵參加職業訓練補助辦法_條文_odt',
      icon: Award,
      tone: 'emerald',
    },
    {
      title: '就學補助生活津貼及金額表',
      desc: '國內外大專校院學雜費補助、就學生活津貼及獎勵核發金額表',
      id: '國軍退除役官兵就學補助生活津貼及獎勵核發金額表_115年7月1日生效__pdf',
      icon: GraduationCap,
      tone: 'violet',
    },
    {
      title: '國家考試與公營招考',
      desc: '就業考試進修補助規定、113 年版公營事業機構參考名冊',
      id: '辦理公開招考之公營事業機構參考名冊_113年版__pdf',
      icon: FolderCheck,
      tone: 'amber',
    },
  ];

  const toneMap = {
    blue: { icon: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300', hover: 'hover:border-blue-300 dark:hover:border-blue-700' },
    emerald: { icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300', hover: 'hover:border-emerald-300 dark:hover:border-emerald-700' },
    violet: { icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300', hover: 'hover:border-violet-300 dark:hover:border-violet-700' },
    amber: { icon: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300', hover: 'hover:border-amber-300 dark:hover:border-amber-700' },
  } as const;

  return (
    <div className="mx-auto w-full max-w-[900px] flex-1 space-y-7 px-3 py-5 sm:space-y-9 sm:px-6 sm:py-8 lg:px-8 lg:py-10 animate-riseIn">
      <section className="relative isolate overflow-hidden rounded-[26px] bg-[#102b4a] text-white shadow-[0_20px_50px_rgba(17,53,91,0.2)] sm:rounded-[32px]">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border-[34px] border-white/5" />
        <div className="absolute -bottom-32 right-12 h-72 w-72 rounded-full bg-[#188b7b]/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:p-11">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-blue-200/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-blue-100 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
              退輔會承辦人法規助手
            </div>
            <h1 className="max-w-xl text-[clamp(1.75rem,4vw,2.85rem)] font-black leading-[1.2] tracking-[-0.04em] text-white">
              法規查詢，從這裡開始。
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100/80 sm:text-[15px]">
              整合就學、就業、職訓與國考相關規定，提供法規全文檢索、條文閱讀與津貼金額試算，協助承辦作業更快、更有依據。
            </p>

            <div className="mt-7 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm">
                <div className="text-xl font-black text-white sm:text-2xl">{regulationCount}</div>
                <div className="mt-1 text-[11px] font-medium text-blue-100/60 sm:text-[11px]">份法規文件</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm">
                <div className="text-xl font-black text-white sm:text-2xl">115</div>
                <div className="mt-1 text-[11px] font-medium text-blue-100/60 sm:text-[11px]">最新修訂年度</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm">
                <div className="text-xl font-black text-[#71dcc5] sm:text-2xl">即時</div>
                <div className="mt-1 text-[11px] font-medium text-blue-100/60 sm:text-[11px]">全文搜尋</div>
              </div>
            </div>
          </div>

          <div className="hidden min-h-[270px] rounded-[24px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100/60">Workspace guide</span>
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-100/70">三步完成查詢</p>
              <div className="mt-4 space-y-3">
                {['輸入關鍵字或條文編號', '檢視條文與附件表單', '必要時開啟津貼試算器'].map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-black text-emerald-200">0{index + 1}</span>
                    <span className="text-sm font-semibold text-white/90">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-blue-100/60">
              <BookOpen className="h-3.5 w-3.5" />
              以公開法規與作業規定整理
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Start here</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-800 dark:text-slate-100">常用操作</h2>
          </div>
          <span className="hidden text-xs font-medium text-slate-400 dark:text-slate-500 sm:inline">快速熟悉工作流程</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="surface-card rounded-[22px] p-4 transition-all hover:-translate-y-0.5 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300"><Search className="h-5 w-5" /></span>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-300">01 · Search</span>
                <h3 className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">全文即時檢索</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-500 dark:text-slate-400">從上方搜尋列輸入關鍵字，立即篩選法規與符合的條文。</p>
              </div>
            </div>
          </div>

          <button onClick={onOpenCalculator} className="surface-card group rounded-[22px] p-4 text-left transition-all hover:-translate-y-0.5 hover:border-emerald-300 dark:hover:border-emerald-700 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"><Calculator className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-300">02 · Calculate</span>
                <h3 className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">津貼金額試算</h3>
                <p className="mt-1.5 text-[13px] leading-6 text-slate-500 dark:text-slate-400">依投保與輔導期限，試算第二類退除役官兵的核發金額。</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">開啟試算器 <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </div>
            </div>
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3 px-1">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">Quick access</p>
            <h2 className="mt-1 text-base font-extrabold text-slate-800 dark:text-slate-100">常用法規快速通道</h2>
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{quickLinks.length} 個入口</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            const tone = toneMap[link.tone as keyof typeof toneMap];
            return (
              <button
                key={link.id}
                onClick={() => onSelectRegulation(link.id)}
                className={`group flex min-h-[100px] w-full items-start gap-3 rounded-[22px] border border-slate-200/90 bg-white p-4 text-left shadow-[0_8px_22px_rgba(31,65,102,0.045)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(31,65,102,0.1)] dark:border-slate-800 dark:bg-slate-900/80 ${tone.hover}`}
              >
                <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${tone.icon}`}><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-2">
                    <span className="text-sm font-extrabold leading-snug text-slate-800 transition-colors group-hover:text-blue-700 dark:text-slate-100 dark:group-hover:text-blue-300">{link.title}</span>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-blue-500 dark:text-slate-600" />
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-6 text-slate-500 dark:text-slate-400">{link.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <p className="px-1 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">資料依據現行公開法規與作業規定整理；正式辦理時，仍請以最新公文、公告及主管機關解釋為準。</p>
    </div>
  );
};
