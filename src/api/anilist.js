import { standardizeMedia } from './utils';

export const searchAnilist = async (title, type) => {
  // Anilist uses ANIME or MANGA – map manhwa/webtoon to MANGA
  const mediaType = (type === 'anime') ? 'ANIME' : 'MANGA';
  const query = `
    query ($search: String, $type: MediaType) {
      Media(search: $search, type: $type) {
        id
        title {
          romaji
          english
        }
        description
        coverImage {
          extraLarge
          large
        }
        bannerImage
        episodes
        chapters
        genres
      }
    }`;
  
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { search: title, type: mediaType }
      })
    });

    if (!res.ok) {
      console.error('Anilist error:', res.status, res.statusText);
      return [];
    }

    const { data } = await res.json();
    if (!data?.Media) return [];
    
    const media = data.Media;
    return [standardizeMedia({
      title: media.title.english || media.title.romaji,
      description: media.description?.replace(/<[^>]*>/g, ''),
      image: media.coverImage?.extraLarge || media.coverImage?.large,
      banner: media.bannerImage,
      episodes: media.episodes || media.chapters,
      genres: media.genres,
      id: media.id,
    }, 'anilist')];
  } catch (error) {
    console.error('Anilist fetch failed:', error);
    return [];
  }
};