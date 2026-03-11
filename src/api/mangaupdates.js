// src/api/mangaupdates.js
import { standardizeMedia } from './utils';

export const searchMangaUpdates = async (title) => {
  const url = `https://api.mangaupdates.com/v1/series/search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ search: title, perpage: 5 })
  });
  const data = await res.json();
  return data.results.map(item => {
    const record = item.record;
    return standardizeMedia({
      title: record.title,
      description: record.description || '',
      image: record.image?.url?.original,
      banner: null,
      episodes: record.chapters,
      genres: record.genres?.map(g => g.genre) || [],
      id: record.series_id,
      year: record.year,
    }, 'mangaupdates');
  });
};