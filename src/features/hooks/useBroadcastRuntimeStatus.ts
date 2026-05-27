import { useEffect, useMemo, useState } from 'react';

import { fetchLiveBroadcasts } from '../../services/api/broadcasts';

type Options = {
  broadcastId?: string | null;
  initialCreatedAt?: string | null;
  initialViewersCount?: number;
};

type BroadcastRuntimeStatus = {
  liveTime: string;
  viewersCount: number;
};

const STATUS_POLL_INTERVAL_MS = 3000;
const CLOCK_TICK_INTERVAL_MS = 1000;

export function useBroadcastRuntimeStatus({
  broadcastId,
  initialCreatedAt,
  initialViewersCount = 0,
}: Options): BroadcastRuntimeStatus {
  const [createdAt, setCreatedAt] = useState<string | null>(
    initialCreatedAt ?? null,
  );
  const [viewersCount, setViewersCount] = useState(initialViewersCount);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    setCreatedAt(initialCreatedAt ?? null);
    setViewersCount(initialViewersCount);
  }, [broadcastId, initialCreatedAt, initialViewersCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, CLOCK_TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!broadcastId) {
      return undefined;
    }

    let disposed = false;

    const load = async () => {
      try {
        const broadcasts = await fetchLiveBroadcasts();
        const broadcast = broadcasts.find(item => item._id === broadcastId);

        if (disposed || !broadcast) {
          return;
        }

        setCreatedAt(broadcast.createdAt ?? null);
        setViewersCount(broadcast.viewersCount ?? 0);
      } catch {
        // Keep the last known values on transient network failures.
      }
    };

    void load();
    const interval = setInterval(() => {
      void load();
    }, STATUS_POLL_INTERVAL_MS);

    return () => {
      disposed = true;
      clearInterval(interval);
    };
  }, [broadcastId]);

  const liveTime = useMemo(() => formatElapsedTime(createdAt, now), [
    createdAt,
    now,
  ]);

  return {
    liveTime,
    viewersCount,
  };
}

function formatElapsedTime(createdAt: string | null, now: number): string {
  if (!createdAt) {
    return '00:00';
  }

  const startedAt = new Date(createdAt).getTime();

  if (!Number.isFinite(startedAt)) {
    return '00:00';
  }

  const totalSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  if (hours > 0) {
    return `${padTimePart(hours)}:${padTimePart(minutes)}:${padTimePart(
      seconds,
    )}`;
  }

  return `${padTimePart(minutes)}:${padTimePart(seconds)}`;
}

function padTimePart(value: number): string {
  return value.toString().padStart(2, '0');
}
