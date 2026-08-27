import { useEffect, useMemo, useRef, useState } from 'react';
import { REGULATIONS_DATA } from './data/regulations';
import { CategoryType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { RegulationViewer, RegulationViewerHandle } from './components/RegulationViewer';
import { CalculatorModal } from './components/CalculatorModal';
import { ReferenceTables } from './components/ReferenceTables';
import { HomeView } from './components/HomeView';
import { ReadingPreferences, readReadingPreferences, saveReadingPreferences } from './components/ReadingSettings';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { onServiceWorkerUpdate, clearAppCacheAndReload } from './register-sw';
import { Sparkles, RefreshCw, X } from 'lucide-react';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('vac_theme') === 'dark' ||
      (!('vac_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [readingPreferences, setReadingPreferences] = useState<ReadingPreferences>(readReadingPreferences);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(() => typeof navigator !== 'undefined' && !navigator.onLine);
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const regulationScrollRef = useRef<HTMLDivElement>(null);
  const regulationViewerRef = useRef<RegulationViewerHandle>(null);
  const [searchMatchStats, setSearchMatchStats] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

  const handleNextMatch = () => {
    regulationViewerRef.current?.nextMatch();
  };

  const handlePrevMatch = () => {
    regulationViewerRef.current?.prevMatch();
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
    localStorage.setItem('vac_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleOnlineState = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineState);
    window.addEventListener('offline', handleOnlineState);
    return () => {
      window.removeEventListener('online', handleOnlineState);
      window.removeEventListener('offline', handleOnlineState);
    };
  }, []);

  // Listen for Service Worker update notifications
  useEffect(() => {
    const unsubscribe = onServiceWorkerUpdate(() => {
      setHasUpdate(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.fontScale = readingPreferences.fontScale;
    root.dataset.lineHeight = readingPreferences.lineHeight;
    root.dataset.fontFamily = readingPreferences.fontFamily;
    saveReadingPreferences(readingPreferences);
  }, [readingPreferences]);

  const searchedRegulations = useMemo(() => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!normalizedKeyword) return REGULATIONS_DATA;

    return REGULATIONS_DATA.filter((reg) => {
      const titleMatch = reg.title.toLowerCase().includes(normalizedKeyword);
      const articleMatch = reg.articles.some(
        (article) => article.title.toLowerCase().includes(normalizedKeyword) || article.content.toLowerCase().includes(normalizedKeyword),
      );
      return titleMatch || articleMatch;
    });
  }, [keyword]);

  const filteredRegulations = useMemo(() => {
    if (activeCategory === 'ALL') return searchedRegulations;
    return searchedRegulations.filter((reg) => reg.category === activeCategory);
  }, [searchedRegulations, activeCategory]);

  const searchStats = useMemo(() => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!normalizedKeyword) {
      return { regCount: filteredRegulations.length, matchCount: 0 };
    }

    let matchCount = 0;
    filteredRegulations.forEach((reg) => {
      reg.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(normalizedKeyword) ||
          article.content.toLowerCase().includes(normalizedKeyword)
        ) {
          matchCount++;
        }
      });
    });

    return { regCount: filteredRegulations.length, matchCount };
  }, [filteredRegulations, keyword]);

  const matchingRegulations = useMemo(() => {
    const normalizedKeyword = keyword.toLowerCase().trim();
    if (!normalizedKeyword) return [];

    return searchedRegulations.map((reg) => {
      const articleMatches = reg.articles.filter(
        (article) =>
          article.title.toLowerCase().includes(normalizedKeyword) ||
          article.content.toLowerCase().includes(normalizedKeyword),
      ).length;
      const titleMatches = reg.title.toLowerCase().includes(normalizedKeyword);
      return {
        id: reg.id,
        title: reg.title,
        category: reg.category,
        matchCount: articleMatches + (titleMatches ? 1 : 0),
        articleMatchCount: articleMatches,
      };
    });
  }, [searchedRegulations, keyword]);

  const currentRegulation = useMemo(
    () => REGULATIONS_DATA.find((reg) => reg.id === selectedRegulationId) || null,
    [selectedRegulationId],
  );

  const handleSelectRegulation = (id: string) => {
    const target = REGULATIONS_DATA.find((item) => item.id === id);
    if (target) {
      setActiveCategory(target.category);
    }
    setSelectedRegulationId(id);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setActiveCategory(category);
    setIsMobileSidebarOpen(false);

    if (category === 'ALL') {
      return;
    }

    setSelectedRegulationId((currentId) => {
      const selected = REGULATIONS_DATA.find((reg) => reg.id === currentId);
      return selected?.category === category ? currentId : null;
    });
  };

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    await clearAppCacheAndReload();
  };

  return (
    <div className="flex min-h-screen flex-col bg-warm-page text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isOffline={isOffline}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Auto-detected new version banner */}
      {hasUpdate && (
        <aside
          aria-label="系統更新提示"
          className="sticky top-[68px] z-40 flex items-center justify-between border-b border-blue-300 bg-gradient-to-r from-blue-900 via-[#1b4d82] to-blue-900 px-4 py-2.5 text-white shadow-md backdrop-blur-md sm:top-[76px] sm:px-6"
        >
          <div className="flex items-center gap-2 text-xs font-bold sm:text-sm">
            <Sparkles className="h-4 w-4 text-amber-300 animate-pulse flex-shrink-0" />
            <span>偵測到法規系統已有最新版本更新！</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyUpdate}
              disabled={isUpdating}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1 text-xs font-extrabold text-[#1b4d82] shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-75"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? '正在更新中…' : '立即載入最新版'}</span>
            </button>
            <button
              onClick={() => setHasUpdate(false)}
              className="rounded-lg p-1 text-blue-200 hover:bg-white/10 hover:text-white"
              title="稍後提醒"
              aria-label="關閉提醒"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </aside>
      )}

      <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row">
        <Sidebar
          regulations={keyword ? searchedRegulations : REGULATIONS_DATA}
          selectedId={currentRegulation?.id}
          onSelectRegulation={handleSelectRegulation}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <SearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            resultStats={searchStats}
            activeCategory={activeCategory}
            readingPreferences={readingPreferences}
            onReadingPreferencesChange={setReadingPreferences}
            hasSelectedRegulation={Boolean(currentRegulation)}
            matchingRegulations={matchingRegulations}
            selectedRegulationId={currentRegulation?.id}
            onSelectRegulation={handleSelectRegulation}
            searchMatchNav={currentRegulation && keyword.trim() ? {
              current: searchMatchStats.current,
              total: searchMatchStats.total,
              onNext: handleNextMatch,
              onPrev: handlePrevMatch,
            } : undefined}
          />

          {currentRegulation && (
            <div className="no-print">
              <ReferenceTables regulation={currentRegulation} />
            </div>
          )}

          {currentRegulation ? (
              <RegulationViewer
                ref={regulationViewerRef}
                regulation={currentRegulation}
                keyword={keyword}
                fontScale={readingPreferences.fontScale}
                lineHeight={readingPreferences.lineHeight}
                fontFamily={readingPreferences.fontFamily}
                scrollContainerRef={regulationScrollRef}
                onMatchStatsChange={setSearchMatchStats}
              />
          ) : (
            <HomeView
              onSelectRegulation={handleSelectRegulation}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              regulationCount={REGULATIONS_DATA.length}
            />
          )}
          <ScrollToTopButton targetRef={currentRegulation ? regulationScrollRef : undefined} />
        </main>
      </div>

      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectRegulation={(regId) => {
          setSelectedRegulationId(regId);
          setActiveCategory('ALL');
        }}
      />
    </div>
  );
};

export default App;
