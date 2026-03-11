// src/components/filters/SortDropdown.jsx

import React from 'react';

export const SortDropdown = ({ sortBy, setSortBy }) => {
  const options = [
    { value: 'title-asc', label: 'Title (A-Z)' },
    { value: 'title-desc', label: 'Title (Z-A)' },
    { value: 'rating-desc', label: 'Highest Rated' },
    { value: 'rating-asc', label: 'Lowest Rated' },
    { value: 'progress-desc', label: 'Most Behind' },
    { value: 'updated-desc', label: 'Recently Updated' },
  ];
  return (
    <select
      value={sortBy}
      onChange={e => setSortBy(e.target.value)}
      className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest outline-none focus:border-white/30"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} className="bg-black">
          {opt.label}
        </option>
      ))}
    </select>
  );
};