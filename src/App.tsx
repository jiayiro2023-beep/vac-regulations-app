import React, { useState, useEffect, useMemo } from 'react';
import { REGULATIONS_DATA, Regulation } from './data/regulations';
import { CategoryType, Bookmark } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';
import { RegulationViewer } from './components/RegulationViewer';
import { CalculatorModal } from './components/CalculatorModal';
import { ReferenceTables } from './components/ReferenceTables';
import { HomeView } from './components/HomeView';

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('vac_theme') === 'dark' ||
      (!('vac_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [activeCategory, setActiveCategory] = useState<CategoryType>('ALL');
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState<boolean>(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('vac_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vac_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vac_theme', 'light');
    }
  }, [darkMode]);

  // Bookmarks effect
  useEffect(() => {
    localStorage.setItem('vac_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  // Toggle bookmark handler
  const handleToggleBookmark = (regulationId: string, articleTitle: string) => {
    setBookmarks(prev => {
      const exists = prev.some(b => b.regulationId === regulationId && b.articleTitle === articleTitle);
      if (exists) {
        return prev.filter(b => !(b.regulationId === regulationId && b.articleTitle === articleTitle));
      } else {
        return [...prev, { regulationId, articleTitle }];
      }
    });
  };

  // Filter regulations based on keyword and bookmarks mode
  const filteredRegulations = useMemo(() => {
    return REGULATIONS_DATA.filter(reg => {
      // 1. Bookmarks Filter
      if (showBookmarksOnly) {
        const hasBookmarkedArticle = reg.articles.some(art =>
          bookmarks.some(b => b.regulationId === reg.id && b.articleTitle === art.title)
        );
        if (!hasBookmarkedArticle) return false;
      }

      // 3. Keyword Filter
      if (keyword.trim()) {
        const kw = keyword.toLowerCase().trim();
        const titleMatch = reg.title.toLowerCase().includes(kw);
        const articleMatch = reg.articles.some(
          art => art.title.toLowerCase().includes(kw) || art.content.toLowerCase().includes(kw)
        );
        return titleMatch || articleMatch;
      }

      return true;
    });
  }, [activeCategory, keyword, showBookmarksOnly, bookmarks]);

  // Result stats for SearchBar
  const resultStats = useMemo(() => {
    if (!keyword.trim()) return { regCount: filteredRegulations.length, matchCount: 0 };
    const kw = keyword.toLowerCase().trim();
    let totalMatches = 0;

    filteredRegulations.forEach(reg => {
      reg.articles.forEach(art => {
        if (art.title.toLowerCase().includes(kw) || art.content.toLowerCase().includes(kw)) {
          totalMatches += 1;
        }
      });
    });

    return { regCount: filteredRegulations.length, matchCount: totalMatches };
  }, [filteredRegulations, keyword]);

  // Active regulation
  const currentRegulation = useMemo(() => {
    return REGULATIONS_DATA.find(r => r.id === selectedRegulationId) || null;
  }, [selectedRegulationId]);

  return (
    <div className="min-h-screen flex flex-col bg-warm-page dark:bg-slate-950 transition-colors">
      {/* Top Header Navigation */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        bookmarkedCount={bookmarks.length}
        onToggleBookmarksOnly={() => setShowBookmarksOnly(!showBookmarksOnly)}
        showBookmarksOnly={showBookmarksOnly}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          if (cat === 'ALL') {
            setSelectedRegulationId(null);
          }
        }}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          regulations={filteredRegulations}
          selectedId={currentRegulation?.id}
          onSelectRegulation={setSelectedRegulationId}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Right Main Content Panel */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Global Search Bar */}
          <SearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            resultStats={resultStats}
          />

          {/* Reference Table overlay if applicable */}
          {currentRegulation && (
            <div className="px-4 pt-4 lg:px-8 max-w-4xl mx-auto w-full">
              <ReferenceTables regulation={currentRegulation} />
            </div>
          )}

          {/* Main Viewer */}
          {currentRegulation ? (
            <RegulationViewer
              regulation={currentRegulation}
              keyword={keyword}
              bookmarks={bookmarks}
              onToggleBookmark={handleToggleBookmark}
            />
          ) : (
            <HomeView
              onSelectRegulation={setSelectedRegulationId}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Interactive Case Officer Calculator Modal */}
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
