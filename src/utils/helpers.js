// src/utils/helpers.js

export const getProgressLabel = (type) => {
  if (['anime', 'tv', 'movie'].includes(type)) return 'EPISODE';
  if (type === 'comic') return 'ISSUE';
  return 'CHAPTER';
};

export const getVolumeLabel = (type) => {
  if (['manga', 'manhwa', 'webtoon', 'comic'].includes(type)) return 'VOLUME';
  return 'SEASON';
};

export const isUpToDate = (item) => {
  if (!item.latestCount) return false;
  const current = parseInt(item.currentEpisode, 10);
  const latest = parseInt(item.latestCount, 10);
  return !isNaN(current) && !isNaN(latest) && current >= latest;
};

export const formatProgress = (item) => {
  const prefix = item.type === 'anime' || item.type === 'tv' ? 'EP' : 'CH';
  if (item.season || item.volume) {
    const seasonVol = item.season ? `S${item.season}` : `Vol${item.volume}`;
    return `${seasonVol} ${prefix}${item.currentEpisode || '?'}`;
  }
  return `${prefix} ${item.currentEpisode || '?'}`;
};

export const isMissingMetadata = (s) => {
  return !s.description || !s.image || !s.sourceId || !s.genres || s.genres.length === 0;
};