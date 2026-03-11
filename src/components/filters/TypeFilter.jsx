// src/components/filters/TypeFilter.jsx

import React from 'react';
import { MEDIA_TYPES } from '../../utils/constants';

export const TypeFilter = ({ activeFilter, setActiveFilter }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {['all', ...MEDIA_TYPES.map(m => m.id)].map(f => (
        <button
          key={f}
          onClick={() => setActiveFilter(f)}
          className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
            activeFilter === f
              ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : 'bg-white/5 text-white/40 border-transparent hover:border-white/20'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
};