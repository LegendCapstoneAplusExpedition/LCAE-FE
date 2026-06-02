import { apiFetch, getAuthHeaders } from './config';

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
  topic?: string;
  host: BroadcastHostDto;
  status: 'live' | 'ended';
  viewersCount?: number;
  createdAt?: string;
};

export type BroadcastAiActionResponse = {
  aiProducerId?: string;
  message?: string;
  success: boolean;
};

export async function fetchLiveBroadcasts(
  signal?: AbortSignal,
): Promise<BroadcastDto[]> {
  const response = await apiFetch('/broadcast/live', {
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
  const response = await apiFetch(`/broadcast/end/${broadcastId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    method: 'POST',
    signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to end broadcast: ${response.status}`);
  }

  return (await response.json()) as { success: boolean };
}

export async function setBroadcastAiEnabled({
  broadcastId,
  enabled,
  signal,
  token,
}: {
  broadcastId: string;
  enabled: boolean;
  signal?: AbortSignal;
  token: string;
}): Promise<BroadcastAiActionResponse> {
  const action = enabled ? 'start' : 'stop';
  const response = await apiFetch(`/broadcast/${broadcastId}/ai/${action}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...getAuthHeaders(token),
    },
    method: 'POST',
    signal,
  });

  const text = await response.text();
  const data = parseJsonObject(text);

  if (!response.ok) {
    const message =
      typeof data.error === 'string'
        ? data.error
        : `Failed to ${action} broadcast AI: ${response.status}`;

    throw new Error(message);
  }

  return {
    aiProducerId:
      typeof data.aiProducerId === 'string' ? data.aiProducerId : undefined,
    message: typeof data.message === 'string' ? data.message : undefined,
    success: typeof data.success === 'boolean' ? data.success : true,
  };
}

function parseJsonObject(text: string): Record<string, unknown> {
  if (!text) {
    return {};
  }

  try {
    const data: unknown = JSON.parse(text);
    return data && typeof data === 'object'
      ? (data as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
