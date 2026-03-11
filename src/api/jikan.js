import { standardizeMedia } from './utils';

export const searchJikan = async (title, type) => {
  // Map manhwa/webtoon to manga (Jikan uses manga for all comics)
  const apiType = (type === 'manhwa' || type === 'webtoon') ? 'manga' : type;
  const url = `https://api.jikan.moe/v4/${apiType}?q=${encodeURIComponent(title)}&limit=5`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data.map(item => standardizeMedia({
    title: item.title,
    description: item.synopsis,
    image: item.images.jpg.large_image_url,
    banner: item.images.jpg.image_url,
    episodes: apiType === 'anime' ? item.episodes : item.chapters,
    genres: item.genres.map(g => g.name),
    id: item.mal_id,
    year: item.year,
  }, 'jikan'));
};