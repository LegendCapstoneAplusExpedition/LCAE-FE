import { API_BASE_URL } from './config';

export type BroadcastHostDto =
  | string
  | {
      _id?: string;
      id?: string;
      username?: string;
    };

export type BroadcastDto = {
  _id: string;
  title: string;
  host: BroadcastHostDto;
  status: 'live' | 'ended';
  viewersCount?: number;
  createdAt?: string;
};

export async function fetchLiveBroadcasts(
  signal?: AbortSignal,
): Promise<BroadcastDto[]> {
  const response = await fetch(`${API_BASE_URL}/broadcast/live`, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch live broadcasts: ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Live broadcasts response must be an array');
  }

  return data as BroadcastDto[];
}

export async function endBroadcast({
  broadcastId,
  signal,
  token,
}: {
  broadcastId: string;
  signal?: AbortSignal;
  token: string;
}): Promise<{ success: boolean }> {
  const response = await fetch(
    `${API_BASE_URL}/broadcast/end/${broadcastId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      method: 'POST',
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to end broadcast: ${response.status}`);
  }

  return (await response.json()) as { success: boolean };
}
