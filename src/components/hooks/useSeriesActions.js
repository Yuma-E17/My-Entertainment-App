import { useCallback } from 'react';

export function useSeriesActions(series, setSeries, setActivityLog) {
  const addSeries = useCallback((newSeries) => {
    setSeries(prev => [newSeries, ...prev]);
    if (setActivityLog) {
      setActivityLog(prev => [
        { id: Date.now(), action: 'Added', seriesTitle: newSeries.title, timestamp: new Date().toISOString() },
        ...prev.slice(0, 49)
      ]);
    }
  }, [setSeries, setActivityLog]);

  const updateSeries = useCallback((updated) => {
    setSeries(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (setActivityLog) {
      setActivityLog(prev => [
        { id: Date.now(), action: 'Updated', seriesTitle: updated.title, timestamp: new Date().toISOString() },
        ...prev.slice(0, 49)
      ]);
    }
  }, [setSeries, setActivityLog]);

  const deleteSeries = useCallback((id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      setSeries(prev => prev.filter(s => s.id !== id));
      if (setActivityLog) {
        setActivityLog(prev => [
          { id: Date.now(), action: 'Deleted', seriesTitle: title, timestamp: new Date().toISOString() },
          ...prev.slice(0, 49)
        ]);
      }
      return true;
    }
    return false;
  }, [setSeries, setActivityLog]);

  const bulkUpdate = useCallback((ids, updates) => {
    setSeries(prev => prev.map(s => ids.includes(s.id) ? { ...s, ...updates } : s));
    if (setActivityLog) {
      setActivityLog(prev => [
        { id: Date.now(), action: 'Bulk updated', seriesTitle: `${ids.length} items`, timestamp: new Date().toISOString() },
        ...prev.slice(0, 49)
      ]);
    }
  }, [setSeries, setActivityLog]);

  return { addSeries, updateSeries, deleteSeries, bulkUpdate };
}