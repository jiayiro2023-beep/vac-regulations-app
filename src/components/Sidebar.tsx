import React, { useState, useEffect } from 'react';
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
  ChevronDown,
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

const CATEGORY_ITEMS: { key: string; label: string; icon: any; color: string }[] = [
  { key: '就業與津貼', label: '就業與穩定津貼', icon: Briefcase, color: 'text-blue-500 dark:text-blue-400' },
  { key: '職業訓練', label: '職業訓練與參照表', icon: Award, color: 'text-emerald-500 dark:text-emerald-400' },
  { key: '就學與進修', label: '就學與大專進修', icon: GraduationCap, color: 'text-indigo-500 dark:text-indigo-400' },
  { key: '國家考試', label: '國家考試', icon: FolderCheck, color: 'text-amber-500 dark:text-amber-400' },
  { key: '眷屬權益', label: '眷屬職訓計畫', icon: Users, color: 'text-rose-500 dark:text-rose-400' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  regulations,
  selectedId,
  onSelectRegulation,
  isMobileOpen,
  onCloseMobile
}) => {
  // Find the selected regulation to auto-expand its category
  const selectedRegulation = regulations.find(r => r.id === selectedId);
  const selectedCategory = selectedRegulation?.category;

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Auto-expand the category of the selected regulation when selectedId or selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setExpandedCategories(prev => ({
        ...prev,
        [selectedCategory]: true
      }));
    }
  }, [selectedCategory]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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

      {/* Single Scrollable Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Header Intro */}
        <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <span>法規類別目錄</span>
          <span className="text-[10px] text-blue-500 dark:text-blue-400 flex items-center gap-1 normal-case font-bold">
            <Sparkles className="w-3 h-3" /> 點擊展開分類
          </span>
        </div>

        {/* Categories Accordion */}
        <div className="space-y-2">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const categoryRegs = regulations.filter(r => r.category === item.key);
            const isExpanded = !!expandedCategories[item.key];
            const hasSelectedInCat = selectedCategory === item.key;

            // If a search or bookmark filter is active, and there are no matching regulations under this category, hide the category header.
            if (categoryRegs.length === 0) return null;

            return (
              <div 
                key={item.key} 
                className={`rounded-2xl border transition-all duration-200 ${
                  hasSelectedInCat
                    ? 'border-blue-100 dark:border-blue-900 bg-slate-50/10 dark:bg-slate-900/10'
                    : 'border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950/20'
                }`}
              >
                {/* Category Header Button */}
                <button
                  onClick={() => toggleCategory(item.key)}
                  className={`w-full flex items-center justify-between p-3 text-sm font-bold transition-all rounded-2xl ${
                    isExpanded 
                      ? 'text-blue-600 dark:text-blue-400 bg-slate-50/80 dark:bg-slate-800/50' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl transition-all ${
                      isExpanded 
                        ? 'bg-blue-100/80 dark:bg-blue-950/60' 
                        : 'bg-slate-100/80 dark:bg-slate-850'
                    }`}>
                      <Icon className={`w-4 h-4 ${isExpanded ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                    </div>
                    <span className="text-xs tracking-wide">{item.label}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Submenu: Regulations List */}
                {isExpanded && (
                  <div className="p-2 space-y-1 border-t border-slate-100/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/20 rounded-b-2xl">
                    {categoryRegs.map((reg) => {
                      const isSelected = reg.id === selectedId;
                      return (
                        <button
                          key={reg.id}
                          onClick={() => {
                            onSelectRegulation(reg.id);
                            onCloseMobile();
                          }}
                          className={`w-full text-left py-2.5 px-3 rounded-xl transition-all flex items-start space-x-2 group ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/80 dark:to-indigo-950/40 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500 dark:border-blue-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-slate-200'
                          }`}
                        >
                          <FileText className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                            isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs leading-snug line-clamp-2">
                              {reg.title}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                              {reg.articles.length} 條/節
                            </span>
                          </div>
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
