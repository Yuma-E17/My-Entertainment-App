import React from 'react';
import { Plus, Star } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { isUpToDate } from '../../utils/helpers';
import { STATUS_CONFIG } from '../../utils/constants';

export const SeriesCard = ({ item, accentColor, settings, onClick, onQuickProgress }) => {
  const statusDisplay = (() => {
    if (item.status === 'watching') {
      if (isUpToDate(item)) {
        return { label: 'Currently Active', color: 'text-blue-400', bg: 'bg-blue-400/10' };
      } else {
        return { label: 'Not Up to Date', color: 'text-red-400', bg: 'bg-red-400/10' };
      }
    }
    return STATUS_CONFIG[item.status];
  })();

  const progress = item.latestCount && item.status === 'watching'
    ? (parseInt(item.currentEpisode) / parseInt(item.latestCount)) * 100
    : null;

  const getUnit = (type) => {
    if (['anime', 'tv', 'movie'].includes(type)) return 'EP';
    return 'CH';
  };
  const unit = getUnit(item.type);

  // Helper for 5-star display (non‑interactive)
  const StarRating = ({ value }) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={12} className={star <= value ? "text-yellow-400 fill-current" : "text-white/20"} />
      ))}
    </div>
  );

  // Wide layout version
  if (settings.wideLayout) {
    return (
      <div
        onClick={onClick}
        className="group relative bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-2xl"
        style={{
          backgroundImage: item.splashImage ? `url(${item.splashImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
        
        <div className="relative z-10 p-6 flex gap-6 items-center">
          {item.image ? (
            <img src={item.image} className="w-24 h-32 object-cover rounded-xl shadow-xl" alt={item.title} />
          ) : (
            <div className="w-24 h-32 bg-white/10 rounded-xl flex items-center justify-center">
              <span className="text-xs opacity-30">No image</span>
            </div>
          )}
          
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase line-clamp-2">{item.title}</h3>
            
            <div className="flex items-center gap-4 mt-2">
              <StarRating value={item.rating} />
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusDisplay.color.replace('text', 'bg')}`} />
                <span className={`text-[10px] font-black tracking-widest ${statusDisplay.color}`}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>
            
            {item.genres && item.genres.length > 0 && (
              <p className="text-xs text-white/60 mt-2 line-clamp-1">
                {item.genres.slice(0, 3).join(' • ')}
              </p>
            )}
            
            {item.status === 'watching' && (
              <p className="text-sm text-white/40 mt-2">
                {unit} {item.currentEpisode}{item.latestCount ? `/${item.latestCount}` : ''}
              </p>
            )}
            {item.season && <p className="text-xs text-white/40 mt-1">Season {item.season}</p>}
            {item.volume && <p className="text-xs text-white/40 mt-1">Volume {item.volume}</p>}
            
            {settings.showProgressBars && progress !== null && (
              <ProgressBar progress={progress} accentColor={accentColor} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // Compact layout
  return (
    <div
      onClick={onClick}
      className="group bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2 transition-all duration-500 cursor-pointer relative flex flex-col shadow-2xl"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        {item.image ? (
          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
        ) : (
          <div className="flex h-full items-center justify-center opacity-10">
            {/* Placeholder */}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

        <div
          className="absolute top-6 left-6 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10"
          style={{ backgroundColor: `${accentColor}30`, color: accentColor }}
        >
          <span className="text-[9px] font-black tracking-widest uppercase opacity-90">{item.type}</span>
        </div>

        <div className="absolute bottom-6 left-8 right-8 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">CURRENT</p>
            {item.status === 'watching' ? (
              <span className="text-2xl font-black italic tracking-tighter">
                {unit} {item.currentEpisode}{item.latestCount ? `/${item.latestCount}` : ''}
              </span>
            ) : (
              <span className="text-sm uppercase tracking-widest text-white/40">
                {item.status}
              </span>
            )}
            {settings.showProgressBars && progress !== null && (
              <ProgressBar progress={progress} accentColor={accentColor} />
            )}
          </div>
          {item.status === 'watching' && (
            <button
              onClick={(e) => { e.stopPropagation(); onQuickProgress(item.id); }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-1 justify-between gap-4">
        <div>
          <h3 className="text-[13px] font-black uppercase italic tracking-tight line-clamp-2 leading-tight min-h-[2.5rem]">
            {item.title}
          </h3>
          {item.genres && item.genres.length > 0 && (
            <p className="text-[9px] text-white/40 uppercase tracking-wider mt-1 line-clamp-1">
              {item.genres.slice(0, 2).join(' • ')}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <StarRating value={item.rating} />
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusDisplay.color.replace('text', 'bg')}`} />
            <span className={`text-[8px] font-black tracking-widest ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};