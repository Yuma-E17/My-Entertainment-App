// src/api/tvmaze.js
import { standardizeMedia } from './utils';

export const searchTvmaze = async (title) => {
  const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.slice(0,5).map(item => {
    const show = item.show;
    return standardizeMedia({
      title: show.name,
      description: show.summary?.replace(/<[^>]*>/g, ''),
      image: show.image?.original || show.image?.medium,
      banner: null,
      episodes: null, // TVmaze doesn't give episode count in search
      genres: show.genres,
      id: show.id,
      year: show.premiered?.slice(0,4),
    }, 'tvmaze');
  });
};