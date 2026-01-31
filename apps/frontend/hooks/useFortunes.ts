import { useAtom } from 'jotai';
import { useEffect, useCallback, useRef } from 'react';
import { apiClient } from '@hoshino/api';
import { fortunesAtom, fortunesLoadingAtom, fortunesErrorAtom, fortunesLoadedAtom } from '../lib/store';

export function useFortunes() {
  const [fortunes, setFortunes] = useAtom(fortunesAtom);
  const [loading, setLoading] = useAtom(fortunesLoadingAtom);
  const [error, setError] = useAtom(fortunesErrorAtom);
  const [loaded, setLoaded] = useAtom(fortunesLoadedAtom);
  const fetching = useRef(false);

  const fetchFortunes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.fortune.list();
      setFortunes(data);
      setLoaded(true);
    } catch (err) {
      console.error(err);
      setError('Failed to load fortunes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setFortunes, setLoading, setError, setLoaded]);

  useEffect(() => {
    // Only fetch if we haven't loaded yet and aren't currently loading or fetching
    if (!loaded && !loading && !fetching.current) {
      fetching.current = true;
      fetchFortunes().finally(() => {
        fetching.current = false;
      });
    }
  }, [loaded, loading, fetchFortunes]);

  return { fortunes, loading, error, refresh: fetchFortunes };
}