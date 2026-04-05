import { useState, useEffect, useCallback } from 'react';

export function useRecommendations(series) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenIds, setHiddenIds] = useState(() => {
    const saved = localStorage.getItem('hidden_recommendations');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const allGenres = series
        .filter(s => s.status === 'watching' || s.status === 'planned')
        .flatMap(s => s.genres || []);
      const genreCounts = allGenres.reduce((acc, g) => {
        acc[g] = (acc[g] || 0) + 1;
        return acc;
      }, {});
      const topGenres = Object.entries(genreCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([g]) => g);

      if (topGenres.length === 0) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      const query = `
        query ($genres: [String]) {
          Page(page: 1, perPage: 20) {
            media(genre_in: $genres, sort: POPULARITY_DESC, type: ANIME) {
              id
              title {
                romaji
                english
              }
              coverImage {
                large
              }
              description
              genres
              episodes
              averageScore
              seasonYear
              format
            }
          }
        }
      `;

      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { genres: topGenres }
        })
      });

      if (!res.ok) {
        console.error('Anilist recommendations error:', res.status);
        setRecommendations([]);
        setLoading(false);
        return;
      }

      const { data } = await res.json();
      const allMedia = data?.Page?.media || [];
      const existingTitles = new Set(series.map(s => s.title.toLowerCase()));
      const newRecs = allMedia
        .filter(m => !existingTitles.has(m.title.english?.toLowerCase() || m.title.romaji?.toLowerCase()))
        .filter(m => !hiddenIds.includes(m.id))
        .slice(0, 6)
        .map(m => ({
          id: m.id,
          title: m.title.english || m.title.romaji,
          type: m.format?.toLowerCase() || 'anime',
          image: m.coverImage?.large,
          description: m.description?.replace(/<[^>]*>/g, ''),
          genres: m.genres,
          episodes: m.episodes,
          score: m.averageScore ? (m.averageScore / 10).toFixed(1) : null,
          year: m.seasonYear,
        }));
      setRecommendations(newRecs);
    } catch (e) {
      console.error('Failed to fetch recommendations', e);
      setRecommendations([]);
    }
    setLoading(false);
  }, [series, hiddenIds]);

  const hideRecommendation = useCallback((id) => {
    const newHidden = [...hiddenIds, id];
    setHiddenIds(newHidden);
    localStorage.setItem('hidden_recommendations', JSON.stringify(newHidden));
    setRecommendations(prev => prev.filter(r => r.id !== id));
  }, [hiddenIds]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 2000);
    return () => clearTimeout(timer);
  }, [fetchRecommendations]);

  return { recommendations, loading, refresh: fetchRecommendations, hideRecommendation };
}