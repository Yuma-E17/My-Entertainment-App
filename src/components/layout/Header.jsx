// src/components/layout/Header.jsx

import React, { forwardRef } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { TypeFilter } from '../filters/TypeFilter';
import { SortDropdown } from '../filters/SortDropdown';

export const Header = forwardRef(({
  activeTab,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  isSyncing
}, ref) => {
  return (
    <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-14 gap-8">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-7xl font-black italic uppercase tracking-tighter">{activeTab}</h2>
          {isSyncing && <RefreshCw size={24} className="animate-spin text-blue-400 opacity-50" />}
        </div>
        <TypeFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-7 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            ref={ref}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="SEARCH YOUR DATABASE..."
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest outline-none focus:border-white/30 focus:bg-white/[0.07] transition-all"
          />
        </div>
      </div>
    </header>
  );
});