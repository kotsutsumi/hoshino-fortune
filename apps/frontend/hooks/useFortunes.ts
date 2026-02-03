import { useAtom } from 'jotai';
import { useEffect, useCallback } from 'react';
import { ApiError, apiClient } from '@hoshino/api';
import { fortunesAtom, fortunesLoadingAtom, fortunesErrorAtom, fortunesLoadedAtom, fortunesFetchingAtom } from '../lib/store';

export function useFortunes() {
  const [fortunes, setFortunes] = useAtom(fortunesAtom);
  const [loading, setLoading] = useAtom(fortunesLoadingAtom);
  const [error, setError] = useAtom(fortunesErrorAtom);
  const [loaded, setLoaded] = useAtom(fortunesLoadedAtom);
  const [fetching, setFetching] = useAtom(fortunesFetchingAtom);

  const fetchFortunes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.fortune.list();
      setFortunes(data);
      setLoaded(true);
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) {
        setError({
          code: err.status === 429 ? 'RATE_LIMITED' : 'API_ERROR',
          message: err.status === 429 ? 'Too many requests. Please wait.' : err.message,
          retryable: err.status !== 503 && err.status < 500,
        });
      } else {
        setError({
          code: 'NETWORK_ERROR',
          message: 'Network error. Check your connection.',
          retryable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [setFortunes, setLoading, setError, setLoaded]);

  useEffect(() => {
    // Only fetch if we haven't loaded yet and aren't currently loading or fetching
    if (!loaded && !loading && !fetching) {
      setFetching(true);
      fetchFortunes().finally(() => {
        setFetching(false);
      });
    }
  }, [loaded, loading, fetching, setFetching, fetchFortunes]);

  return { fortunes, loading, error, refresh: fetchFortunes };
}
