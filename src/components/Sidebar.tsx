import { useEffect, useState } from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Users,
  FolderCheck,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  X,
} from 'lucide-react';

interface RegulationItem {
  id: string;
  title: string;
  category: string;
  articles: unknown[];
}

interface SidebarProps {
  regulations: RegulationItem[];
  selectedId?: string;
  onSelectRegulation: (id: string) => void;
  activeCategory: string;
  onSelectCategory: (cat: any) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ITEMS: { key: string; label: string; icon: typeof Briefcase; color: string; tint: string }[] = [
  { key: '就業與津貼', label: '就業與穩定津貼', icon: Briefcase, color: 'text-[#1b4d82] dark:text-blue-300', tint: 'bg-[#eaf1fb] dark:bg-blue-950/60' },
  { key: '職業訓練', label: '職業訓練與參照表', icon: Award, color: 'text-[#116d5b] dark:text-emerald-300', tint: 'bg-[#e6f4ef] dark:bg-emerald-950/50' },
  { key: '就學與進修', label: '就學與大專進修', icon: GraduationCap, color: 'text-[#5243aa] dark:text-violet-300', tint: 'bg-[#eeedfa] dark:bg-violet-950/50' },
  { key: '國家考試', label: '國家考試', icon: FolderCheck, color: 'text-[#9c6010] dark:text-amber-300', tint: 'bg-[#fef4e2] dark:bg-amber-950/50' },
  { key: '眷屬權益', label: '眷屬職訓計畫', icon: Users, color: 'text-[#b8324e] dark:text-rose-300', tint: 'bg-[#faeaee] dark:bg-rose-950/50' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  regulations,
  selectedId,
  onSelectRegulation,
  activeCategory,
  onSelectCategory,
  isMobileOpen,
  onCloseMobile,
}) => {
  const selectedRegulation = regulations.find((reg) => reg.id === selectedId);
  const selectedCategory = selectedRegulation?.category;
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories((prev) => ({ ...prev, [selectedCategory]: true }));
    }
  }, [selectedCategory]);

  const handleSelectCategory = (category: string) => {
    onSelectCategory(category);
    if (category === 'ALL') onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col border-r border-[#e3dcce]/90 bg-[#faf8f3]/95 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex items-center justify-between border-b border-[#e3dcce]/80 px-4 py-4 dark:border-slate-800 lg:px-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#867f70] dark:text-slate-500">Knowledge base</p>
          <h2 className="mt-1 text-base font-extrabold text-[#1c222b] dark:text-slate-100">法規分類與目錄</h2>
        </div>
        <button
          onClick={onCloseMobile}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-[#eee7d8] hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          aria-label="關閉法規目錄"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        <button
          onClick={() => handleSelectCategory('ALL')}
          className={`mb-4 flex min-h-11 w-full items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all active:scale-[0.99] ${
            activeCategory === 'ALL'
              ? 'border-blue-300 bg-[#eef4fb] text-[#1b4d82] shadow-sm dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200'
              : 'border-[#e3dcce] bg-white/80 text-slate-700 hover:border-blue-300 hover:bg-[#f2ece0] hover:text-[#1b4d82] dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-200'
          }`}
        >
          <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${activeCategory === 'ALL' ? 'bg-[#1b4d82] text-white' : 'bg-white text-slate-500 dark:bg-slate-800 dark:text-slate-300'}`}>
            <LayoutGrid className="h-4 w-4" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-extrabold">全部法規</span>
            <span className="mt-0.5 block text-[11px] text-[#7d7768] dark:text-slate-500">瀏覽完整法規庫</span>
          </span>
          <span className="rounded-full bg-[#eee7d8] px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-400">{regulations.length}</span>
        </button>

        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#867f70] dark:text-slate-500">法規類別</span>
          <span className="text-[11px] font-medium text-[#867f70] dark:text-slate-500">點擊展開</span>
        </div>

        <div className="space-y-2.5">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const categoryRegs = regulations.filter((reg) => reg.category === item.key);
            const isExpanded = !!expandedCategories[item.key];
            const hasSelectedInCat = selectedCategory === item.key || activeCategory === item.key;

            if (categoryRegs.length === 0) return null;

            return (
              <div
                key={item.key}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  hasSelectedInCat
                    ? 'border-blue-300 bg-[#edf3fb]/70 shadow-sm dark:border-blue-900 dark:bg-blue-950/20'
                    : 'border-[#e3dcce] bg-white dark:border-slate-800 dark:bg-slate-900/40'
                }`}
              >
                <button
                  onClick={() => setExpandedCategories((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  className={`flex min-h-[58px] w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors ${
                    isExpanded ? 'bg-[#f6f2e8] dark:bg-slate-800/50' : 'hover:bg-[#f8f5ee] dark:hover:bg-slate-800/40'
                  }`}
                  aria-expanded={isExpanded}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl ${item.tint}`}>
                      <Icon className={`h-4 w-4 ${item.color}`} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block whitespace-normal text-sm font-extrabold leading-snug ${hasSelectedInCat ? 'text-[#1b4d82] dark:text-blue-200' : 'text-slate-800 dark:text-slate-200'}`}>{item.label}</span>
                      <span className="mt-0.5 block text-[11px] font-medium text-[#7d7768] dark:text-slate-500">{categoryRegs.length} 份法規</span>
                    </span>
                  </span>
                  {isExpanded ? <ChevronDown className="h-4 w-4 flex-shrink-0 text-[#1b4d82]" /> : <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="space-y-1 border-t border-[#e3dcce]/80 bg-[#fcfbf7] p-2 dark:border-slate-800 dark:bg-slate-950/30">
                    {categoryRegs.map((reg) => {
                      const isSelected = reg.id === selectedId;
                      return (
                        <button
                          key={reg.id}
                          onClick={() => {
                            onSelectRegulation(reg.id);
                            onCloseMobile();
                          }}
                          className={`flex min-h-[52px] w-full items-start gap-2 rounded-xl px-2.5 py-2 text-left transition-all active:scale-[0.99] ${
                            isSelected
                              ? 'bg-[#1b4d82] text-white shadow-md shadow-blue-950/15'
                              : 'text-slate-700 hover:bg-[#ede6d4] hover:text-[#102c4e] dark:text-slate-400 dark:hover:bg-blue-950/50 dark:hover:text-blue-100'
                          }`}
                        >
                          <FileText className={`mt-0.5 h-3.5 w-3.5 flex-shrink-0 ${isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold leading-snug">{reg.title}</span>
                            <span className={`mt-1 block text-[11px] ${isSelected ? 'text-blue-100' : 'text-[#7d7768] dark:text-slate-500'}`}>{reg.articles.length} 條／節</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#e3dcce]/80 px-4 py-3 dark:border-slate-800">
        <p className="text-xs leading-relaxed text-[#7d7768] dark:text-slate-500">資料依據現行公開法規與作業規定整理，正式辦理仍請依最新公文及主管機關公告為準。</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-[76px] hidden h-[calc(100vh-76px)] w-[304px] flex-shrink-0 lg:flex no-print">
        {content}
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden" role="dialog" aria-modal="true" aria-label="法規分類與目錄">
          <button className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onCloseMobile} aria-label="關閉目錄遮罩" />
          <div className="relative z-10 h-full w-[min(88vw,360px)] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
