import React from 'react';
import { 
  Briefcase, 
  Award, 
  GraduationCap, 
  FolderCheck, 
  Search, 
  Bookmark, 
  Calculator, 
  ArrowRight 
} from 'lucide-react';

interface HomeViewProps {
  onSelectRegulation: (id: string) => void;
  onOpenCalculator: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectRegulation,
  onOpenCalculator
}) => {
  // Find key regulations for quick access cards
  const quickLinks = [
    {
      title: "穩定就業津貼作業說明",
      desc: "包含第一類與第二類退除役官兵穩定就業津貼最新核發標準",
      id: "促進退除役官兵穩定就業津貼發給辦法作業說明_114.12.24修訂___1__pdf",
      icon: Briefcase,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/60"
    },
    {
      title: "職業訓練補助辦法",
      desc: "榮民及第二類退除役官兵職業訓練補助次數與參照表",
      id: "_國軍退除役官兵參加職業訓練補助辦法_條文_odt",
      icon: Award,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60"
    },
    {
      title: "就學補助生活津貼及金額表",
      desc: "國內外大專校院學雜費補助、就學生活津貼及獎勵核發金額表",
      id: "國軍退除役官兵就學補助生活津貼及獎勵核發金額表_115年7月1日生效__pdf",
      icon: GraduationCap,
      color: "from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60"
    },
    {
      title: "國家考試與公營招考",
      desc: "就業考試進修補助規定、113年版公營事業機構參考名冊",
      id: "辦理公開招考之公營事業機構參考名冊_113年版__pdf",
      icon: FolderCheck,
      color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60"
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 sm:p-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl text-white">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        
        <div className="relative space-y-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            退輔會承辦人法規助手
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            歡迎使用 退輔會法規檢索系統
          </h2>
          <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
            本平台為輔導會就學、就業、職訓及國考相關法規與津貼標準之專用查詢入口。已整合 115 年最新生效標準與智慧型津貼試算器。
          </p>
        </div>
      </div>

      {/* Guide Steps Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
          系統使用指引
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                1. 全文即時檢索
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                在上方搜尋列中輸入任何關鍵字，即可在全部法規的條文、附件與附表中進行全文即時搜尋。
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Bookmark className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                2. 快速書籤儲存
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                點擊法規條文旁的書籤按鈕，可將常用條文收藏在瀏覽器中，方便日後透過右上角「已書籤」快速篩選。
              </p>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                3. 津貼金額試算
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                點擊右上角「津貼與試算器」，只需簡單勾選身分，即可自動計算穩定就業津貼、就學生活津貼等金額。
              </p>
            </div>
            <button 
              onClick={onOpenCalculator}
              className="mt-4 flex items-center justify-between w-full px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-200/50 dark:border-emerald-800/50"
            >
              <span>立即開啟試算器</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Entry Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1">
          常用法規快速通道
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectRegulation(link.id)}
                className="w-full text-left p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-blue-400 dark:hover:border-blue-600 shadow-2xs hover:shadow-sm transition-all duration-200 group flex items-start space-x-4"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${link.color} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {link.title}
                    </h4>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                  <p className="text-xs text-slate-450 dark:text-slate-400 leading-normal line-clamp-2">
                    {link.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
