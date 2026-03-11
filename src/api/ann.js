// src/api/ann.js
import { standardizeMedia } from './utils';

export const searchAnn = async (title) => {
  const url = `https://cdn.animenewsnetwork.com/encyclopedia/api.xml?title=~${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  const items = xml.querySelectorAll('item');
  return Array.from(items).slice(0,5).map(item => standardizeMedia({
    title: item.getAttribute('name'),
    description: '', // not in this endpoint
    image: item.querySelector('img')?.getAttribute('src'),
    banner: null,
    episodes: null,
    genres: [],
    id: item.getAttribute('id'),
    year: null,
  }, 'ann'));
};