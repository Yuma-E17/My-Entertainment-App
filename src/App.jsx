import React, { useState, useMemo, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import { useLocalStorage } from './components/hooks/useLocalStorage';
import { useKeyboardShortcuts } from './components/hooks/useKeyboardShortcuts';
import { useSeriesActions } from './components/hooks/useSeriesActions';
import { Sidebar } from './components/layout/Sidebar';
import { MainContent } from './components/layout/MainContent';
import { EditSeriesModal } from './components/modals/EditSeriesModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { BulkSyncModal } from './components/modals/BulkSyncModal';
import { SearchModal } from './components/modals/SearchModal';
import { KeyboardHelp } from './components/cards/KeyboardHelp';
import { THEMES, INITIAL_DATA } from './utils/constants';
import { isMissingMetadata } from './utils/helpers';
import { searchAllApis } from './api';

function App() {
  const [series, setSeries] = useLocalStorage('mel_pro_v3_final', INITIAL_DATA);
  const [activityLog, setActivityLog] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreFilterMode, setGenreFilterMode] = useState('or');
  const [isAdding, setIsAdding] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  
  // Settings with localStorage persistence
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mel_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
    return {
      theme: 'midnight',
      customAccent: null,
      showProgressBars: true,
      wideLayout: false,
      customStatuses: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('mel_settings', JSON.stringify(settings));
  }, [settings]);

  const [showSettings, setShowSettings] = useState(false);
  const [showBulkSyncModal, setShowBulkSyncModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchInputRef = useRef();

  const currentTheme = THEMES[settings.theme] || THEMES.midnight;
  const accentColor = settings.customAccent || currentTheme.accent;

  const { addSeries, updateSeries, deleteSeries } = useSeriesActions(series, setSeries, setActivityLog);

  // Filtering and sorting logic
  const baseList = useMemo(() => {
    if (activeTab === 'dashboard' || activeTab === 'favorites' || activeTab === 'all') return series;
    return series.filter(s => s.status === activeTab);
  }, [series, activeTab]);

  const filteredByType = useMemo(() => {
    if (activeFilter === 'all') return baseList;
    return baseList.filter(s => s.type === activeFilter);
  }, [baseList, activeFilter]);

  const filteredBySearch = useMemo(() => {
    if (!searchQuery) return filteredByType;
    const q = searchQuery.toLowerCase();
    return filteredByType.filter(s => s.title.toLowerCase().includes(q));
  }, [filteredByType, searchQuery]);

  const filteredByGenres = useMemo(() => {
    if (selectedGenres.length === 0) return filteredBySearch;
    if (genreFilterMode === 'or') {
      return filteredBySearch.filter(s =>
        s.genres?.some(g => selectedGenres.includes(g))
      );
    } else {
      return filteredBySearch.filter(s =>
        selectedGenres.every(g => s.genres?.includes(g))
      );
    }
  }, [filteredBySearch, selectedGenres, genreFilterMode]);

  const sortedCollection = useMemo(() => {
    const list = filteredByGenres;
    switch (sortBy) {
      case 'title-asc':
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...list].sort((a, b) => b.title.localeCompare(a.title));
      case 'rating-desc':
        return [...list].sort((a, b) => b.rating - a.rating);
      case 'rating-asc':
        return [...list].sort((a, b) => a.rating - b.rating);
      case 'progress-desc':
        return [...list].sort((a, b) => {
          const aBehind = a.latestCount ? parseInt(a.latestCount) - parseInt(a.currentEpisode) : 0;
          const bBehind = b.latestCount ? parseInt(b.latestCount) - parseInt(b.currentEpisode) : 0;
          return bBehind - aBehind;
        });
      case 'updated-desc':
        return [...list].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      default:
        return list;
    }
  }, [filteredByGenres, sortBy]);

  const displayedCollection = activeTab === 'favorites'
    ? sortedCollection.filter(s => s.isFavorite)
    : sortedCollection;

  const allGenres = useMemo(() => {
    const genres = new Set();
    baseList.forEach(s => s.genres?.forEach(g => genres.add(g)));
    return Array.from(genres).sort();
  }, [baseList]);

  // Handlers
  const handleNewSeries = () => {
    setEditingSeries({
      id: Date.now(),
      title: '',
      type: 'manga',
      status: 'watching',
      currentEpisode: '0',
      rating: 0,
      genres: [],
    });
    setIsAdding(true);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleEditSeries = (item) => {
    setEditingSeries(item);
    setIsAdding(true);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleSaveSeries = (updated) => {
    const exists = series.some(s => s.id === updated.id);
    if (exists) {
      updateSeries(updated);
      toast.success('Series updated');
      setIsAdding(false);
      return;
    }

    const duplicate = series.find(s => s.title.toLowerCase() === updated.title.toLowerCase());
    if (duplicate) {
      if (!window.confirm(`"${updated.title}" already exists. Add anyway?`)) {
        return;
      }
    }

    addSeries(updated);
    toast.success('Series added');
    setIsAdding(false);
  };

  const handleDeleteSeries = (id) => {
    const title = series.find(s => s.id === id)?.title || 'this series';
    const deleted = deleteSeries(id, title);
    if (deleted) {
      toast.success('Series deleted');
      setIsAdding(false);
    }
  };

  const handleQuickProgress = (id) => {
    setSeries(prev => prev.map(s => {
      if (s.id === id) {
        const newEpisode = (parseInt(s.currentEpisode) || 0) + 1;
        return { ...s, currentEpisode: newEpisode.toString() };
      }
      return s;
    }));
    toast.success('Progress updated', { icon: '➕' });
  };

  const handleRandomPick = () => {
    if (series.length === 0) {
      toast.error('No series to pick from');
      return;
    }
    const randomIndex = Math.floor(Math.random() * series.length);
    handleEditSeries(series[randomIndex]);
  };

  const handleEditSelected = () => {
    toast('Select a series first', { icon: 'ℹ️' });
  };

  const handleCloseModal = () => {
    setIsAdding(false);
    setShowSettings(false);
    setShowBulkSyncModal(false);
    setShowSearchModal(false);
    setShowHelp(false);
  };

  const handleSearch = async (title, type) => {
    setSearching(true);
    setShowSearchModal(true);
    const results = await searchAllApis(title, type);
    setSearchResults(results);
    setSearching(false);
  };

  const handleSearchSelect = (result) => {
    setEditingSeries(prev => ({
      ...prev,
      description: result.description,
      image: result.image,
      splashImage: result.banner,
      genres: result.genres || [],
      latestCount: result.episodes,
      season: result.season,
      volume: result.volume,
      sourceId: result.sourceId,
      sourceApi: result.sourceApi,
    }));
    setShowSearchModal(false);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(series, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mel-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Backup downloaded');
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!Array.isArray(imported)) {
          toast.error('Invalid file format');
          return;
        }
        if (window.confirm('Replace current list or merge? Press OK to replace, Cancel to merge.')) {
          setSeries(imported);
          toast.success('List replaced');
        } else {
          const merged = [...series];
          imported.forEach(newItem => {
            const index = merged.findIndex(s => s.id === newItem.id);
            if (index >= 0) {
              merged[index] = newItem;
            } else {
              merged.push(newItem);
            }
          });
          setSeries(merged);
          toast.success('List merged');
        }
      } catch {
        toast.error('Invalid JSON');
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  const resetToDefault = () => {
    if (window.confirm('This will erase all your data. Are you sure?')) {
      setSeries(INITIAL_DATA);
      toast.success('Reset to default');
    }
  };

  const handleBulkSyncStart = (selectedSeries) => {
    setShowBulkSyncModal(false);
    if (selectedSeries.length > 0) {
      handleSearch(selectedSeries[0].title, selectedSeries[0].type);
    }
  };

  useKeyboardShortcuts({
    focusSearch: () => searchInputRef.current?.focus(),
    newSeries: handleNewSeries,
    editSelected: handleEditSelected,
    closeModal: handleCloseModal,
    showHelp: () => setShowHelp(true),
  });

  return (
    <div className="min-h-screen text-white font-sans flex overflow-hidden" style={{ backgroundColor: currentTheme.bg }}>
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#333', color: '#fff' } }} />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-black/50 rounded-lg backdrop-blur-sm border border-white/10"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar with overlay */}
      <div className={`fixed inset-0 z-40 lg:static lg:inset-auto lg:z-auto transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onNewSeries={handleNewSeries}
          onBulkSync={() => setShowBulkSyncModal(true)}
          onOpenSettings={() => setShowSettings(true)}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className={`flex-1 overflow-y-auto px-4 lg:px-10 py-16 scroll-smooth ${sidebarOpen ? 'ml-0' : 'ml-0'} lg:ml-[280px]`}>
        <MainContent
          activeTab={activeTab}
          series={series}
          accentColor={accentColor}
          settings={settings}
          onEditSeries={handleEditSeries}
          onQuickProgress={handleQuickProgress}
          activityLog={activityLog}
          onRandomPick={handleRandomPick}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isSyncing={isSyncing}
          searchInputRef={searchInputRef}
          allGenres={allGenres}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          genreFilterMode={genreFilterMode}
          setGenreFilterMode={setGenreFilterMode}
          displayedCollection={displayedCollection}
        />
      </main>

      {isAdding && (
        <EditSeriesModal
          series={editingSeries}
          setSeries={setEditingSeries}
          onSave={handleSaveSeries}
          onDelete={handleDeleteSeries}
          onClose={() => setIsAdding(false)}
          onSearch={handleSearch}
          accentColor={accentColor}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          setSettings={setSettings}
          onClose={() => setShowSettings(false)}
          onExport={exportData}
          onImport={importData}
          onReset={resetToDefault}
        />
      )}

      {showBulkSyncModal && (
        <BulkSyncModal
          series={series}
          onClose={() => setShowBulkSyncModal(false)}
          onStart={handleBulkSyncStart}
        />
      )}

      {showSearchModal && (
        <SearchModal
          results={searchResults}
          searching={searching}
          onSelect={handleSearchSelect}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {showHelp && <KeyboardHelp onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;