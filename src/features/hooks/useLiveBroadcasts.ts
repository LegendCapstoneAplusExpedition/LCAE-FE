import { useCallback, useEffect, useState } from 'react';

import {
  type BroadcastDto,
  fetchLiveBroadcasts,
} from '../../services/api/broadcasts';
import type { LiveSession } from '../mocks';

type LiveBroadcastsState = {
  data: LiveSession[];
  error: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
};

function getHostName(host: BroadcastDto['host']): string {
  if (typeof host === 'string') {
    return host;
  }

  return host.username ?? host.id ?? host._id ?? '멘토';
}

function toLiveSession(broadcast: BroadcastDto): LiveSession {
  return {
    createdAt: broadcast.createdAt,
    id: broadcast._id,
    tags: ['라이브', '실시간 멘토링'],
    title: broadcast.title,
    free: true,
    mentor: getHostName(broadcast.host),
    viewers: broadcast.viewersCount ?? 0,
  };
}

export function useLiveBroadcasts(): LiveBroadcastsState {
  const [data, setData] = useState<LiveSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const broadcasts = await fetchLiveBroadcasts(signal);
      setData(broadcasts.map(toLiveSession));
    } catch (nextError) {
      if (nextError instanceof Error && nextError.name === 'AbortError') {
        return;
      }

      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Failed to fetch live broadcasts',
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);

    return () => controller.abort();
  }, [load]);

  return {
    data,
    error,
    loading,
    refetch: () => load(),
  };
}
