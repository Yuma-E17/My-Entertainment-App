// src/api/wikipedia.js
import { standardizeMedia } from './utils';

export const searchWikipedia = async (title) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query.search.slice(0,5);
  // For each, we could fetch page images, but that's extra requests.
  return pages.map(page => standardizeMedia({
    title: page.title,
    description: page.snippet.replace(/<[^>]*>/g, ''),
    image: null,
    banner: null,
    episodes: null,
    genres: [],
    id: page.pageid,
    year: null,
  }, 'wikipedia'));
};