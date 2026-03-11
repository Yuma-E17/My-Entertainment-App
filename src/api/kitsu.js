import { standardizeMedia } from './utils';

export const searchKitsu = async (title, type) => {
  // Map manhwa/webtoon to manga (Kitsu doesn't have separate types)
  const apiType = (type === 'manhwa' || type === 'webtoon') ? 'manga' : type;
  const url = `https://kitsu.io/api/edge/${apiType}?filter[text]=${encodeURIComponent(title)}&page[limit]=5`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data.map(item => {
    const attrs = item.attributes;
    return standardizeMedia({
      title: attrs.canonicalTitle,
      description: attrs.synopsis,
      image: attrs.posterImage?.original,
      banner: attrs.coverImage?.original,
      episodes: apiType === 'anime' ? attrs.episodeCount : attrs.chapterCount,
      genres: [], // Kitsu requires a separate request for genres
      id: item.id,
      year: attrs.startDate?.slice(0,4),
    }, 'kitsu');
  });
};