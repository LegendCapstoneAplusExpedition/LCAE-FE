import { useCallback, useEffect, useState } from 'react';

import {
  disconnectBroadcastSocket,
  emitBroadcastSocketWithAck,
  getBroadcastSocket,
  getConnectedBroadcastSocket,
} from '../../services/socket/broadcastSocket';

type SocketAck =
  | {
      success: true;
      existingProducers?: Array<{ producerId: string }>;
      rtpCapabilities?: unknown;
    }
  | {
      success: false;
      error?: string;
    };

type ReceiveChatPayload = {
  createdAt?: string;
  message: string;
  username: string;
};

export type BroadcastChatMessage = ReceiveChatPayload & {
  id: string;
};

type Options = {
  autoJoin?: boolean;
  broadcastId?: string | null;
  disconnectOnUnmount?: boolean;
  token?: string | null;
};

const MESSAGE_LIMIT = 100;

export function useBroadcastChat({
  autoJoin = false,
  broadcastId,
  disconnectOnUnmount = false,
  token,
}: Options): {
  error: string | null;
  joined: boolean;
  messages: BroadcastChatMessage[];
  sendMessage: (message: string) => Promise<void>;
} {
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState<BroadcastChatMessage[]>([]);

  useEffect(() => {
    if (!broadcastId || !token) {
      setError(null);
      setJoined(false);
      setMessages([]);
      return undefined;
    }

    let disposed = false;

    const handleReceiveChat = (payload: ReceiveChatPayload) => {
      setMessages(currentMessages => [
        {
          ...payload,
          id: `${payload.createdAt ?? Date.now()}-${payload.username}-${
            payload.message
          }`,
        },
        ...currentMessages,
      ].slice(0, MESSAGE_LIMIT));
    };

    setError(null);

    getConnectedBroadcastSocket(token)
      .then(async socket => {
        if (disposed) {
          return;
        }

        socket.on('receiveChat', handleReceiveChat);

        if (!autoJoin) {
          setJoined(true);
          return;
        }

        const response = await emitBroadcastSocketWithAck<SocketAck>(
          socket,
          'joinBroadcast',
          { broadcastId },
        );

        if (disposed) {
          return;
        }

        if (!response.success) {
          setError(response.error ?? '라이브 채팅방에 입장하지 못했습니다.');
          setJoined(false);
          return;
        }

        setError(null);
        setJoined(true);
      })
      .catch(nextError => {
        if (disposed) {
          return;
        }

        setError(
          nextError instanceof Error
            ? nextError.message
            : '라이브 채팅 연결에 실패했습니다.',
        );
        setJoined(false);
      });

    return () => {
      disposed = true;
      setJoined(false);
      getBroadcastSocket()?.off('receiveChat', handleReceiveChat);

      if (disconnectOnUnmount) {
        disconnectBroadcastSocket();
      }
    };
  }, [autoJoin, broadcastId, disconnectOnUnmount, token]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!broadcastId || !token || !joined) {
        return;
      }

      const socket = await getConnectedBroadcastSocket(token);
      socket.emit('sendChat', { message });
    },
    [broadcastId, joined, token],
  );

  return {
    error,
    joined,
    messages,
    sendMessage,
  };
}
