// src/api/trakt.js
import { standardizeMedia } from './utils';
const TRAKT_CLIENT_ID = import.meta.env.VITE_TMDB_KEY;

export const searchTrakt = async (title, type) => {
  // type: 'movie', 'show'
  const url = `https://api.trakt.tv/search/${type}?query=${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_CLIENT_ID
    }
  });
  const data = await res.json();
  return data.slice(0,5).map(item => {
    const media = item[type];
    return standardizeMedia({
      title: media.title,
      description: media.overview,
      image: null, // no image in search; would need to fetch images separately
      banner: null,
      episodes: type === 'show' ? media.aired_episodes : null,
      genres: media.genres,
      id: media.ids.trakt,
      year: media.year,
    }, 'trakt');
  });
};