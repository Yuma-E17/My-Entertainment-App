// src/api/omdb.js
import { standardizeMedia } from './utils';

const OMDB_KEY = import.meta.env.VITE_OMDB_KEY;

export const searchOmdb = async (title, type = 'movie') => {
  // First, search for basic results
  const searchUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(title)}&type=${type}&apikey=${OMDB_KEY}`;
  
  try {
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    
    if (searchData.Response === 'False' || !searchData.Search) {
      return [];
    }
    
    // For each result, fetch full details (optional, but gives better data)
    const detailedResults = await Promise.all(
      searchData.Search.slice(0, 5).map(async (item) => {
        // Fetch full details by ID
        const detailUrl = `https://www.omdbapi.com/?i=${item.imdbID}&apikey=${OMDB_KEY}`;
        const detailRes = await fetch(detailUrl);
        const detailData = await detailRes.json();
        
        return standardizeMedia({
          title: item.Title,
          description: detailData.Plot !== 'N/A' ? detailData.Plot : '',
          image: item.Poster !== 'N/A' ? item.Poster : null,
          banner: null,
          episodes: type === 'series' ? detailData.totalSeasons : null,
          genres: detailData.Genre ? detailData.Genre.split(', ') : [],
          id: item.imdbID,
          year: item.Year,
        }, 'omdb');
      })
    );
    
    return detailedResults;
  } catch (error) {
    console.error('OMDB search failed:', error);
    return [];
  }
};