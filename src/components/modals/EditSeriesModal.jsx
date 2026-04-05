import React, { useRef } from 'react';
import { X, Trash2, Heart, Search, Star } from 'lucide-react';
import { MEDIA_TYPES, STATUS_CONFIG } from '../../utils/constants';
import toast from 'react-hot-toast';

export const EditSeriesModal = ({
  series,
  setSeries,
  onSave,
  onDelete,
  onClose,
  onSearch,
  accentColor,
}) => {
  const searchTimeoutRef = useRef(null);

  const handleSearchClick = (title, type) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(title, type);
    }, 500);
  };

  const handleMarkCaughtUp = () => {
    if (series.latestCount) {
      setSeries({ ...series, currentEpisode: series.latestCount.toString() });
      toast.success(`Caught up! Current ${series.type === 'anime' || series.type === 'tv' ? 'episode' : 'chapter'} set to ${series.latestCount}`);
    } else {
      toast.error('No latest count available. Please sync metadata first.');
    }
  };

  if (!series) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl overflow-y-auto">
      <div className="my-auto w-full max-w-5xl bg-[#0a0c10] border border-white/10 rounded-[4rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
        {/* Header with splash background */}
        <div className="h-80 relative">
          {series.splashImage && (
            <img src={series.splashImage} className="w-full h-full object-cover opacity-40" alt="" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-10 right-10 p-4 rounded-full bg-white/5 hover:bg-white/10 hover:rotate-90 transition-all border border-white/10"
          >
            <X size={24} />
          </button>
          <div className="absolute -bottom-16 left-16 flex items-end gap-10">
            <div className="w-44 h-64 rounded-3xl bg-black border-2 border-white/10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] shrink-0">
              {series.image && <img src={series.image} className="w-full h-full object-cover" alt="" />}
            </div>
            <div className="pb-20 space-y-4">
              <input
                value={series.title}
                onChange={(e) => setSeries({ ...series, title: e.target.value })}
                className="bg-transparent text-5xl font-black italic uppercase tracking-tighter outline-none w-[600px] placeholder:opacity-20"
                placeholder="ENTER TITLE..."
              />
              <div className="flex gap-6 items-center flex-wrap">
                <div className="flex gap-2">
                  {MEDIA_TYPES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSeries({ ...series, type: m.id })}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest border transition-all ${
                        series.type === m.id
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 text-white/40 border-transparent hover:border-white/10'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleSearchClick(series.title, series.type)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Search size={12} /> SEARCH ONLINE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="p-20 pt-32 grid grid-cols-2 gap-20">
          <div className="space-y-12">
            {/* Rating section above STATUS */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">YOUR RATING</label>
              <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/10">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSeries({ ...series, rating: star })}
                      className="focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={star <= series.rating ? "text-yellow-400 fill-current" : "text-white/20"}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-2xl font-black text-white/60">{series.rating}/5</span>
              </div>
            </div>

            {/* STATUS section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">STATUS</label>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(STATUS_CONFIG).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSeries({ ...series, status: s })}
                    className={`py-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      series.status === s
                        ? 'bg-white text-black border-white shadow-xl scale-[1.02]'
                        : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* GENRES section */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">GENRES</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {series.genres &&
                  series.genres.map((g, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-[9px] font-black tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
              </div>
              <input
                type="text"
                value={series.genres ? series.genres.join(', ') : ''}
                onChange={(e) =>
                  setSeries({
                    ...series,
                    genres: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="Action, Drama, Comedy..."
                className="w-full p-4 bg-white/5 rounded-2xl border border-white/10 text-sm outline-none focus:border-white/20"
              />
            </div>

            {/* Progress & Season/Volume */}
            <div className="flex items-center gap-10 p-8 bg-white/[0.03] rounded-3xl border border-white/10">
              <div className="flex-1">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 block">
                  CURRENT EPISODE/CHAPTER
                </label>
                <input
                  type="text"
                  value={series.currentEpisode}
                  onChange={(e) => setSeries({ ...series, currentEpisode: e.target.value })}
                  className="bg-transparent text-5xl font-black outline-none w-full tracking-tighter"
                />
              </div>
              <div className="h-16 w-px bg-white/10" />
              <div className="flex-1">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3 block">
                  {series.type === 'anime' || series.type === 'tv' ? 'SEASON' : 'VOLUME'}
                </label>
                <input
                  type="text"
                  value={series.season || series.volume || ''}
                  onChange={(e) => {
                    if (['anime', 'tv', 'movie'].includes(series.type)) {
                      setSeries({ ...series, season: e.target.value });
                    } else {
                      setSeries({ ...series, volume: e.target.value });
                    }
                  }}
                  className="bg-transparent text-3xl font-black outline-none w-full tracking-tighter"
                  placeholder="e.g., S2 or Vol5"
                />
              </div>
            </div>

            {/* Mark as caught up button */}
            {series.latestCount && (
              <button
                onClick={handleMarkCaughtUp}
                className="w-full py-3 rounded-xl bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/30 transition-colors"
              >
                Mark as caught up
              </button>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-10 flex flex-col justify-between">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">SYNOPSIS</label>
              <textarea
                value={series.description || ''}
                onChange={(e) => setSeries({ ...series, description: e.target.value })}
                placeholder="SYNOPSIS..."
                className="w-full p-8 bg-white/5 rounded-3xl border border-white/10 text-[12px] font-medium text-white/40 leading-relaxed italic h-48 outline-none focus:border-white/20 resize-none scrollbar-hide"
              />
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => onDelete(series.id)}
                className="p-6 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3 border bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setSeries({ ...series, isFavorite: !series.isFavorite })}
                className={`p-6 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3 border ${
                  series.isFavorite
                    ? 'bg-red-500/10 border-red-500/50 text-red-500'
                    : 'bg-white/5 text-white/20 border-transparent hover:border-white/10'
                }`}
              >
                <Heart size={20} fill={series.isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={() => onSave(series)}
                className="flex-1 py-6 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{ backgroundColor: accentColor, color: '#fff' }}
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};