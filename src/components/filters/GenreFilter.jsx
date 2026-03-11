// src/components/filters/GenreFilter.jsx

import React from 'react';

export const GenreFilter = ({ allGenres, selectedGenres, toggleGenre }) => {
  if (allGenres.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {allGenres.map(genre => (
        <button
          key={genre}
          onClick={() => toggleGenre(genre)}
          className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            selectedGenres.includes(genre)
              ? 'bg-white text-black border-white'
              : 'bg-white/5 text-white/40 border-transparent hover:border-white/20'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};