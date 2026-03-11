import { searchAnilist } from './anilist';
import { searchJikan } from './jikan';
import { searchKitsu } from './kitsu';
import { searchMangaDex } from './mangadex';
// import { searchMangaUpdates } from './mangaupdates'; // CORS issue – disabled
import { searchTmdb } from './tmdb';
import { searchTvmaze } from './tvmaze';
import { searchOmdb } from './omdb';
import { searchComicVine } from './comicvine';
import { searchTrakt } from './trakt';
import { searchAnn } from './ann';

export const searchAllApis = async (title, type) => {
  const promises = [];

  // Anime / Manga / Manhwa / Webtoon
  if (['anime', 'manga', 'manhwa', 'webtoon'].includes(type)) {
    const apiType = type === 'webtoon' ? 'manga' : type;
    promises.push(searchAnilist(title, apiType));
    promises.push(searchJikan(title, apiType));
    promises.push(searchKitsu(title, apiType));
    promises.push(searchMangaDex(title));
    // promises.push(searchMangaUpdates(title)); // disabled
    promises.push(searchAnn(title));
  }

  // TV / Movie
  if (['tv', 'movie'].includes(type)) {
    promises.push(searchTmdb(title, type));
    promises.push(searchTvmaze(title));
    promises.push(searchOmdb(title));
    promises.push(searchTrakt(title, type === 'tv' ? 'show' : 'movie'));
  }

  // Comics
  if (type === 'comic') {
    promises.push(searchComicVine(title));
  }

  const results = await Promise.allSettled(promises);
  const all = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(Boolean);

  return all.slice(0, 20);
};