// src/components/utils/api.js

// Import all the individual API functions
// Adjust the paths if your api folder is at a different level
import { searchMangaDex } from '../../api/mangadex';
import { searchMangaUpdates } from '../../api/mangaupdates';
import { searchOMDb } from '../../api/omdb';
import { searchTMDB } from '../../api/tmdb';
import { searchTrakt } from '../../api/trakt';
import { searchTVMaze } from '../../api/tvmaze';
import { searchWikipedia } from '../../api/wikipedia';
// Add other APIs as needed (anilist, jikan, kitsu, etc.)

/**
 * Search all configured APIs for a given title and media type.
 * Returns a combined array of results, deduplicated by title similarity.
 */
export async function searchAllApis(title, type) {
  const results = [];

  // Determine which APIs to call based on media type
  const promises = [];

  // Example: always call these
  promises.push(searchMangaDex(title, type).catch(() => []));
  promises.push(searchMangaUpdates(title, type).catch(() => []));
  promises.push(searchWikipedia(title, type).catch(() => []));

  // Call TMDB for movies/TV
  if (type === 'movie' || type === 'tv') {
    promises.push(searchTMDB(title, type).catch(() => []));
    promises.push(searchTrakt(title, type).catch(() => []));
    promises.push(searchTVMaze(title, type).catch(() => []));
    promises.push(searchOMDb(title, type).catch(() => []));
  }

  // Wait for all promises and flatten results
  const apiResults = await Promise.all(promises);
  apiResults.forEach(res => results.push(...res));

  // Simple deduplication by title (you can enhance this)
  const seen = new Set();
  const unique = [];
  for (const item of results) {
    const key = item.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(item);
    }
  }

  return unique;
}