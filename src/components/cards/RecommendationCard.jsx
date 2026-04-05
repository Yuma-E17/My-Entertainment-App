import React from 'react';
import { Star, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const RecommendationCard = ({ rec, accentColor, onAdd, onHide }) => {
  const handleAdd = () => {
    const newSeries = {
      id: Date.now(),
      title: rec.title,
      type: rec.type,
      status: 'planned',
      currentEpisode: '0',
      rating: 0,
      image: rec.image,
      description: rec.description,
      genres: rec.genres,
      latestCount: rec.episodes,
    };
    onAdd(newSeries);
    toast.success(`Added "${rec.title}" to your list`);
  };

  const handleHide = (e) => {
    e.stopPropagation();
    onHide(rec.id);
    toast.success('Recommendation hidden');
  };

  return (
    <div
      className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group relative overflow-hidden cursor-pointer"
      onClick={handleAdd}
    >
      <button
        onClick={handleHide}
        className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70"
      >
        <X size={16} className="text-white/60" />
      </button>
      {rec.image && (
        <img src={rec.image} className="w-full h-40 object-cover rounded-xl mb-4" alt="" />
      )}
      <h4 className="text-lg font-black uppercase tracking-tight line-clamp-2">{rec.title}</h4>
      <p className="text-[10px] text-white/40 mt-1">{rec.type}</p>
      {rec.genres && rec.genres.length > 0 && (
        <p className="text-[9px] text-white/30 mt-1 line-clamp-1">{rec.genres.slice(0,2).join(' • ')}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        {rec.score && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-yellow-400 fill-current" />
            <span className="text-xs text-white/60">{rec.score}</span>
          </div>
        )}
        {rec.year && (
          <span className="text-xs text-white/30">{rec.year}</span>
        )}
      </div>
    </div>
  );
};