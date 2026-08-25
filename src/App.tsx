import { useEffect, useMemo, useRef, useState } from 'react';
import { REGULATIONS_DATA } from './data/regulations';
import { CategoryType } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { RegulationViewer } from './components/RegulationViewer';
import { CalculatorModal } from './components/CalculatorModal';
import { ReferenceTables } from './components/ReferenceTables';
import { HomeView } from './components/HomeView';
import { ReadingPreferences, readReadingPreferences, saveReadingPreferences } from './components/ReadingSettings';
import { ScrollToTopButton } from './components/ScrollToTopButton';

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
  const regulationScrollRef = useRef<HTMLDivElement>(null);

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
  }, [activeCategory, searchedRegulations]);

  const resultStats = useMemo(() => {
    if (!keyword.trim()) return { regCount: filteredRegulations.length, matchCount: 0 };
    const normalizedKeyword = keyword.toLowerCase().trim();
    const matchCount = filteredRegulations.reduce((total, reg) => (
      total + reg.articles.filter(
        (article) => article.title.toLowerCase().includes(normalizedKeyword) || article.content.toLowerCase().includes(normalizedKeyword),
      ).length
    ), 0);
    return { regCount: filteredRegulations.length, matchCount };
  }, [filteredRegulations, keyword]);

  const currentRegulation = useMemo(
    () => REGULATIONS_DATA.find((reg) => reg.id === selectedRegulationId) || null,
    [selectedRegulationId],
  );

  const handleSelectRegulation = (regulationId: string) => {
    const selected = REGULATIONS_DATA.find((reg) => reg.id === regulationId);
    setSelectedRegulationId(regulationId);
    if (selected) setActiveCategory(selected.category as CategoryType);
    setIsMobileSidebarOpen(false);
  };

  const handleSelectCategory = (category: CategoryType) => {
    setActiveCategory(category);
    setIsMobileSidebarOpen(false);

    if (category === 'ALL') {
      setSelectedRegulationId(null);
      return;
    }

    setSelectedRegulationId((currentId) => {
      const selected = REGULATIONS_DATA.find((reg) => reg.id === currentId);
      return selected?.category === category ? currentId : null;
    });
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
            resultStats={resultStats}
            activeCategory={activeCategory}
            readingPreferences={readingPreferences}
            onReadingPreferencesChange={setReadingPreferences}
          />

          {currentRegulation && (
            <div className="w-full px-3 pt-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-[860px]">
                <ReferenceTables regulation={currentRegulation} />
              </div>
            </div>
          )}

          {currentRegulation ? (
              <RegulationViewer
                regulation={currentRegulation}
                keyword={keyword}
                fontScale={readingPreferences.fontScale}
                lineHeight={readingPreferences.lineHeight}
                fontFamily={readingPreferences.fontFamily}
                scrollContainerRef={regulationScrollRef}
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
