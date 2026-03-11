// src/api/comicvine.js
import { standardizeMedia } from './utils';

const CV_KEY = import.meta.env.VITE_COMICVINE_KEY;
export const searchComicVine = async (title) => {
  const url = `https://comicvine.gamespot.com/api/search/?api_key=${CV_KEY}&format=json&query=${encodeURIComponent(title)}&resources=issue,volume`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results.slice(0,5).map(item => standardizeMedia({
    title: item.name || item.volume?.name,
    description: item.description || '',
    image: item.image?.medium_url,
    banner: null,
    episodes: item.issue_number,
    genres: [],
    id: item.id,
    year: item.start_year,
  }, 'comicvine'));
};