import { standardizeMedia } from './utils';
const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Cache genre lists
let movieGenres = [];
let tvGenres = [];

const fetchGenres = async (type) => {
  const url = `${BASE_URL}/genre/${type}/list?api_key=${TMDB_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.genres.reduce((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});
};

const getGenreNames = async (ids, mediaType) => {
  if (mediaType === 'movie') {
    if (!movieGenres.length) movieGenres = await fetchGenres('movie');
    return ids.map(id => movieGenres[id]).filter(Boolean);
  } else {
    if (!tvGenres.length) tvGenres = await fetchGenres('tv');
    return ids.map(id => tvGenres[id]).filter(Boolean);
  }
};

export const searchTmdb = async (title, type) => {
  const mediaType = type === 'movie' ? 'movie' : 'tv';
  const url = `${BASE_URL}/search/${mediaType}?api_key=${TMDB_KEY}&query=${encodeURIComponent(title)}`;
  const res = await fetch(url);
  const data = await res.json();
  
  const results = await Promise.all(data.results.slice(0, 5).map(async item => {
    const isTV = mediaType === 'tv';
    const genreIds = item.genre_ids || [];
    const genreNames = await getGenreNames(genreIds, mediaType);
    
    return standardizeMedia({
      title: item.title || item.name,
      description: item.overview,
      image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      banner: item.backdrop_path ? `https://image.tmdb.org/t/p/w1280${item.backdrop_path}` : null,
      episodes: isTV ? item.number_of_episodes : null,
      genres: genreNames,
      id: item.id,
      year: (item.release_date || item.first_air_date)?.slice(0,4),
      season: isTV ? `Season ${item.number_of_seasons}` : null,
    }, 'tmdb');
  }));
  
  return results;
};