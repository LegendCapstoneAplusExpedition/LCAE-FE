import { io, type Socket } from 'socket.io-client';

import { SOCKET_BASE_URL } from '../api/config';

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
let socketToken: string | null = null;

export function connectBroadcastSocket(token: string): Socket {
  if (socket && socketToken === token) {
    return socket;
  }

  socket?.disconnect();
  socketToken = token;
  socket = io(SOCKET_BASE_URL, {
    auth: { token },
    reconnection: true,
    timeout: 15000,
  });

  return socket;
}

export function disconnectBroadcastSocket(): void {
  socket?.disconnect();
  socket = null;
  socketToken = null;
}

export function getBroadcastSocket(): Socket | null {
  return socket;
}

export async function getConnectedBroadcastSocket(
  token: string,
): Promise<Socket> {
  const nextSocket = connectBroadcastSocket(token);

  await waitForSocketConnection(nextSocket);

  return nextSocket;
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
