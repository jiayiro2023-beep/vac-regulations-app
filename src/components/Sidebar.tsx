import React from 'react';
import { Regulation } from '../data/regulations';
import { CategoryType } from '../types';
import { 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Users, 
  FolderCheck, 
  ChevronRight,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

interface SidebarProps {
  regulations: Regulation[];
  selectedId: string;
  onSelectRegulation: (id: string) => void;
  activeCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const CATEGORY_ITEMS: { key: CategoryType; label: string; icon: any; color: string }[] = [
  { key: 'ALL', label: '全部法規與附表', icon: Layers, color: 'text-slate-500' },
  { key: '就業與津貼', label: '就業與穩定津貼', icon: Briefcase, color: 'text-blue-500' },
  { key: '職業訓練', label: '職業訓練與參照表', icon: Award, color: 'text-emerald-500' },
  { key: '就學與進修', label: '就學與大專進修', icon: GraduationCap, color: 'text-indigo-500' },
  { key: '考試與公營名冊', label: '就業考試與公營名冊', icon: FolderCheck, color: 'text-amber-500' },
  { key: '眷屬權益', label: '眷屬職訓計畫', icon: Users, color: 'text-rose-500' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  regulations,
  selectedId,
  onSelectRegulation,
  activeCategory,
  onSelectCategory,
  isMobileOpen,
  onCloseMobile
}) => {
  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800">
      {/* Mobile Drawer Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between lg:hidden">
        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
          法規分類與目錄
        </span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Category Pills Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
        <h2 className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          法規類別導覽
        </h2>
        <div className="space-y-1">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeCategory === item.key;
            const count = item.key === 'ALL'
              ? regulations.length 
              : regulations.filter(r => r.category === item.key).length;

            return (
              <button
                key={item.key}
                onClick={() => {
                  onSelectCategory(item.key);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : item.color}`} />
                  <span>{item.label}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSelected 
                    ? 'bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regulation Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <div className="px-2 py-1 flex items-center justify-between text-xs font-medium text-slate-400">
          <span>法規文件列表 ({regulations.length})</span>
          <span className="text-[10px] text-blue-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 點擊檢視條文
          </span>
        </div>

        {regulations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            無符合條件之法規
          </div>
        ) : (
          regulations.map((reg) => {
            const isSelected = reg.id === selectedId;
            return (
              <button
                key={reg.id}
                onClick={() => {
                  onSelectRegulation(reg.id);
                  onCloseMobile();
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/70 dark:to-indigo-950/50 border-blue-300 dark:border-blue-700 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                    }`} />
                    <span className={`text-xs font-semibold leading-snug line-clamp-2 ${
                      isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }`}>
                      {reg.title}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 transition-transform ${
                    isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100'
                  }`} />
                </div>
                
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px]">
                    {reg.category}
                  </span>
                  <span>{reg.articles.length} 條條文/節</span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (visible >= lg) */}
      <aside className="hidden lg:flex w-80 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 no-print">
        {content}
      </aside>

      {/* Mobile Drawer (visible < lg when open) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <div className="relative w-80 max-w-[85vw] h-full shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
