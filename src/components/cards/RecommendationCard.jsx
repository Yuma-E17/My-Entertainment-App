// src/components/cards/RecommendationCard.jsx

import React from 'react';

export const RecommendationCard = ({ rec, accentColor, onAdd }) => {
  return (
    <div
      onClick={() => onAdd(rec)}
      className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] cursor-pointer transition-all group relative overflow-hidden"
    >
      {rec.image && (
        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
          style={{
            backgroundImage: `url(${rec.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
          }}
        />
      )}
      <div className="relative z-10">
        <div className="flex items-start gap-4">
          {rec.image ? (
            <img src={rec.image} className="w-16 h-20 object-cover rounded-lg shadow-lg" alt="" />
          ) : (
            <div className="w-16 h-20 bg-white/5 rounded-lg flex items-center justify-center">
              {/* Placeholder */}
            </div>
          )}
          <div className="flex-1">
            <h4 className="text-sm font-black uppercase tracking-tight line-clamp-2">{rec.title}</h4>
            <p className="text-[10px] text-white/40 mt-1">{rec.type}</p>
            {rec.genres && rec.genres.length > 0 && (
              <p className="text-[8px] text-white/30 mt-1 line-clamp-1">{rec.genres.slice(0,2).join(' • ')}</p>
            )}
          </div>
        </div>
        <div className="mt-4 text-center text-[9px] font-black text-blue-400 border-t border-white/5 pt-3">
          Click to add to planned
        </div>
      </div>
    </div>
  );
};