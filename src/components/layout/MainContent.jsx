import React from 'react';
import { Shuffle } from 'lucide-react'; // <-- ADD THIS
import { StatsCards } from '../dashboard/StatsCards';
import { NeedCatchUp } from '../dashboard/NeedCatchUp';
import { Recommendations } from '../dashboard/Recommendations';
import { ActivityLog } from '../dashboard/ActivityLog';
import { Header } from './Header';
import { GenreFilter } from '../filters/GenreFilter';
import { SeriesCard } from '../cards/SeriesCard';

export const MainContent = ({
  activeTab,
  series,
  accentColor,
  settings,
  onEditSeries,
  onQuickProgress,
  activityLog,
  onRandomPick,
  // Header props
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  isSyncing,
  searchInputRef,
  // Genre filter props
  allGenres,
  selectedGenres,
  setSelectedGenres,
  genreFilterMode,
  setGenreFilterMode,
  // Collection
  displayedCollection,
}) => {
  if (activeTab === 'dashboard') {
    return (
      <div className="max-w-[1600px] mx-auto space-y-14">
        <div className="flex justify-end">
          <button
            onClick={onRandomPick}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 text-[10px] font-black tracking-widest transition-colors"
          >
            <Shuffle size={14} /> RANDOM
          </button>
        </div>
        <StatsCards series={series} accentColor={accentColor} />
        <NeedCatchUp series={series} accentColor={accentColor} settings={settings} onEdit={onEditSeries} />
        <Recommendations series={series} accentColor={accentColor} onAdd={onEditSeries} settings={settings} />
        <ActivityLog log={activityLog} accentColor={accentColor} />
      </div>
    );
  }

  return (
    <>
      <Header
        ref={searchInputRef}
        activeTab={activeTab}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isSyncing={isSyncing}
      />
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setGenreFilterMode('or')}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
            genreFilterMode === 'or' ? 'bg-white text-black' : 'bg-white/5 text-white/40'
          }`}
        >
          OR
        </button>
        <button
          onClick={() => setGenreFilterMode('and')}
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
            genreFilterMode === 'and' ? 'bg-white text-black' : 'bg-white/5 text-white/40'
          }`}
        >
          AND
        </button>
      </div>
      <GenreFilter
        allGenres={allGenres}
        selectedGenres={selectedGenres}
        toggleGenre={(genre) => {
          setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
          );
        }}
      />
      <div className={`grid gap-10 ${
        settings.wideLayout
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
      }`}>
        {displayedCollection.map(item => (
          <SeriesCard
            key={item.id}
            item={item}
            accentColor={accentColor}
            settings={settings}
            onClick={() => onEditSeries(item)}
            onQuickProgress={onQuickProgress}
          />
        ))}
      </div>
    </>
  );
};