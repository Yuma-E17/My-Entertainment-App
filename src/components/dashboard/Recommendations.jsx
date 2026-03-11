import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useRecommendations } from '../hooks/useRecommendations';
import { RecommendationCard } from '../cards/RecommendationCard';
import { SkeletonCard } from '../cards/SkeletonCard';

export const Recommendations = ({ series, accentColor, onAdd, settings }) => {
  const { recommendations, loading, refresh } = useRecommendations(series);

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-3xl font-black italic uppercase tracking-tighter" style={{ color: accentColor }}>
          Recommended for you
        </h3>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black tracking-widest"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          REFRESH
        </button>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} wide={false} />)}
        </div>
      ) : recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} accentColor={accentColor} onAdd={onAdd} />
          ))}
        </div>
      ) : (
        <div className="p-20 text-center text-white/20 italic border border-white/5 rounded-[3rem]">
          No recommendations available – add more series to your list.
        </div>
      )}
    </div>
  );
};