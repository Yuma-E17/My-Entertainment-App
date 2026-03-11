import { standardizeMedia } from './utils';

// Helper to fetch cover image for a manga
const fetchCoverImage = async (mangaId, filename) => {
  if (!filename) return null;
  return `https://uploads.mangadex.org/covers/${mangaId}/${filename}.512.jpg`;
};

export const searchMangaDex = async (title) => {
  const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=5&includes[]=cover_art`;
  const res = await fetch(url);
  const data = await res.json();
  
  const results = await Promise.all(data.data.map(async (manga) => {
    const attributes = manga.attributes;
    const titleObj = attributes.title;
    const mainTitle = titleObj.en || Object.values(titleObj)[0];
    
    // Find cover art relationship
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    let image = null;
    if (coverRel && coverRel.attributes) {
      image = await fetchCoverImage(manga.id, coverRel.attributes.fileName);
    } else if (coverRel) {
      try {
        const coverRes = await fetch(`https://api.mangadex.org/cover/${coverRel.id}`);
        const coverData = await coverRes.json();
        if (coverData.data) {
          image = await fetchCoverImage(manga.id, coverData.data.attributes.fileName);
        }
      } catch (e) {
        console.warn('Failed to fetch cover for', mainTitle);
      }
    }
    
    return standardizeMedia({
      title: mainTitle,
      description: attributes.description?.en || '',
      image: image,
      banner: null,
      episodes: attributes.chaptersCount || null,          // latest chapter count
      genres: attributes.tags?.map(t => t.attributes.name.en) || [],
      id: manga.id,
      year: attributes.year,
      volume: attributes.lastVolume || null,               // latest volume (if available)
    }, 'mangadex');
  }));
  
  return results;
};