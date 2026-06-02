import { useCallback, useEffect, useState } from 'react';

import {
  fetchLiveBroadcasts,
  type BroadcastDto,
} from '../../services/api/broadcasts';
import {
  fetchMySubscriptions,
  type SubscriptionDto,
} from '../../services/api/users';

export type SubscribedMentor = {
  id: string;
  username: string;
  broadcastId?: string;
  broadcastTitle?: string;
  live: boolean;
  viewers: number;
};

type State = {
  error: string | null;
  loading: boolean;
  mentors: SubscribedMentor[];
};

function getMentorId(sub: SubscriptionDto): string {
  return typeof sub.mentorId === 'string' ? sub.mentorId : sub.mentorId._id;
}

function getMentorUsername(sub: SubscriptionDto): string {
  return typeof sub.mentorId === 'string' ? '' : (sub.mentorId.username ?? '');
}

function findBroadcast(
  mentorId: string,
  mentorUsername: string,
  broadcasts: BroadcastDto[],
): BroadcastDto | undefined {
  return broadcasts.find(b => {
    const host = b.host;
    if (typeof host === 'string') {
      return host === mentorId;
    }
    return (
      host._id === mentorId ||
      host.id === mentorId ||
      (mentorUsername !== '' && host.username === mentorUsername)
    );
  });
}

export function useSubscriptions(authToken: string | null): State {
  const [state, setState] = useState<State>({
    error: null,
    loading: false,
    mentors: [],
  });

  const load = useCallback(
    async (signal: AbortSignal) => {
      if (!authToken) {
        setState({ error: null, loading: false, mentors: [] });
        return;
      }

      setState(prev => ({ ...prev, error: null, loading: true }));

      try {
        const [subs, broadcasts] = await Promise.all([
          fetchMySubscriptions(authToken, signal),
          fetchLiveBroadcasts(signal),
        ]);

        const mentors: SubscribedMentor[] = subs.map(sub => {
          const id = getMentorId(sub);
          const username = getMentorUsername(sub);
          const broadcast = findBroadcast(id, username, broadcasts);

          return {
            id,
            username,
            broadcastId: broadcast?._id,
            broadcastTitle: broadcast?.title,
            live: Boolean(broadcast),
            viewers: broadcast?.viewersCount ?? 0,
          };
        });

        setState({ error: null, loading: false, mentors });
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setState({
          error: '구독 정보를 불러오지 못했습니다.',
          loading: false,
          mentors: [],
        });
      }
    },
    [authToken],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return state;
}
