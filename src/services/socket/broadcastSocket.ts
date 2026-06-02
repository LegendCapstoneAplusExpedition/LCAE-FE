import { io, type Socket } from 'socket.io-client';

import {
  getAuthHeaders,
  getActiveSocketBaseUrl,
  getSocketBaseUrlCandidates,
  setActiveSocketBaseUrl,
} from '../api/config';

export type BroadcastSession = {
  broadcastId: string;
  createdAt?: string;
  rtpCapabilities?: unknown;
  title: string;
  viewersCount?: number;
};

type CreateBroadcastResponse =
  | {
      success: true;
      broadcastId: string;
      createdAt?: string;
      rtpCapabilities?: unknown;
      viewersCount?: number;
    }
  | {
      success: false;
      error?: string;
    };

let socket: Socket | null = null;
let socketBaseUrl: string | null = null;
let socketToken: string | null = null;

export function connectBroadcastSocket(
  token: string,
  baseUrl = getActiveSocketBaseUrl(),
): Socket {
  if (socket && socketToken === token && socketBaseUrl === baseUrl) {
    return socket;
  }

  socket?.disconnect();
  socketBaseUrl = baseUrl;
  socketToken = token;
  socket = io(baseUrl, {
    auth: { token },
    extraHeaders: getAuthHeaders(token),
    reconnection: true,
    timeout: 15000,
  });

  return socket;
}

export function disconnectBroadcastSocket(): void {
  socket?.disconnect();
  socket = null;
  socketBaseUrl = null;
  socketToken = null;
}

export function getBroadcastSocket(): Socket | null {
  return socket;
}

export async function getConnectedBroadcastSocket(
  token: string,
): Promise<Socket> {
  if (socket && socketToken === token && socket.connected) {
    if (socketBaseUrl) {
      setActiveSocketBaseUrl(socketBaseUrl);
    }

    return socket;
  }

  let lastError: unknown;

  for (const baseUrl of getSocketBaseUrlCandidates()) {
    const nextSocket = connectBroadcastSocket(token, baseUrl);

    try {
      await waitForSocketConnection(nextSocket);
      setActiveSocketBaseUrl(baseUrl);

      return nextSocket;
    } catch (error) {
      lastError = error;
      nextSocket.disconnect();

      if (socket === nextSocket) {
        socket = null;
        socketBaseUrl = null;
        socketToken = null;
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Socket.IO 연결에 실패했습니다.');
}

export function emitBroadcastSocketWithAck<T>(
  nextSocket: Socket,
  eventName: string,
  payload: unknown,
): Promise<T> {
  return emitWithAck<T>(nextSocket, eventName, payload);
}

export async function createBroadcastSession({
  title,
  token,
}: {
  title: string;
  token: string;
}): Promise<BroadcastSession> {
  const nextSocket = await getConnectedBroadcastSocket(token);

  const response = await emitWithAck<CreateBroadcastResponse>(
    nextSocket,
    'createBroadcast',
    { title },
  );

  if (!response.success) {
    throw new Error(response.error ?? '방송 생성 실패');
  }

  return {
    broadcastId: response.broadcastId,
    createdAt: response.createdAt ?? new Date().toISOString(),
    rtpCapabilities: response.rtpCapabilities,
    title,
    viewersCount: response.viewersCount ?? 0,
  };
}

function waitForSocketConnection(nextSocket: Socket): Promise<void> {
  if (nextSocket.connected) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error('Socket.IO 연결 시간이 초과되었습니다.'));
    }, 10000);

    const cleanup = () => {
      clearTimeout(timeout);
      nextSocket.off('connect', handleConnect);
      nextSocket.off('connect_error', handleConnectError);
    };

    const handleConnect = () => {
      cleanup();
      resolve();
    };

    const handleConnectError = (error: Error) => {
      cleanup();
      reject(error);
    };

    nextSocket.once('connect', handleConnect);
    nextSocket.once('connect_error', handleConnectError);
  });
}

function emitWithAck<T>(
  nextSocket: Socket,
  eventName: string,
  payload: unknown,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`${eventName} 응답 시간이 초과되었습니다.`));
    }, 10000);

    nextSocket.emit(eventName, payload, (response: T) => {
      clearTimeout(timeout);
      resolve(response);
    });
  });
}
