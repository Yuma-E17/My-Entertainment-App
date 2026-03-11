export const standardizeMedia = (data, source) => ({
  title: data.title || '',
  description: data.description || '',
  image: data.image || '',
  banner: data.banner || '',
  episodes: data.episodes || data.chapters || 0,  // latest episode/chapter count
  genres: data.genres || [],
  sourceId: data.id || '',
  sourceApi: source,
  year: data.year || null,
  season: data.season || null,     // e.g., "Season 2" or season number
  volume: data.volume || null,      // e.g., "Vol 5" or volume number
  // optional: store raw response for debugging
  raw: data,
});