import { useEffect, useRef, useState } from 'react';

import {
  startBroadcastAudioConsumer,
  type BroadcastAudioConsumerSession,
} from '../../services/socket/broadcastAudioConsumer';

type Options = {
  broadcastId?: string | null;
  onBroadcastEnded?: () => void;
  token?: string | null;
};

type BroadcastAudioConsumerStatus =
  | 'idle'
  | 'connecting'
  | 'listening'
  | 'error';

type Result = {
  error: string | null;
  status: BroadcastAudioConsumerStatus;
};

export function useBroadcastAudioConsumer({
  broadcastId,
  onBroadcastEnded,
  token,
}: Options): Result {
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<BroadcastAudioConsumerStatus>('idle');
  const sessionRef = useRef<BroadcastAudioConsumerSession | null>(null);

  useEffect(() => {
    if (!broadcastId || !token) {
      setError(null);
      setStatus('idle');
      return undefined;
    }

    let disposed = false;

    setError(null);
    setStatus('connecting');

    startBroadcastAudioConsumer({ broadcastId, onBroadcastEnded, token })
      .then(session => {
        if (disposed) {
          session.stop();
          return;
        }

        sessionRef.current = session;
        setStatus('listening');
      })
      .catch(nextError => {
        if (disposed) {
          return;
        }

        sessionRef.current = null;
        setError(
          nextError instanceof Error
            ? nextError.message
            : '방송 오디오 연결에 실패했습니다.',
        );
        setStatus('error');
      });

    return () => {
      disposed = true;
      sessionRef.current?.stop();
      sessionRef.current = null;
      setStatus('idle');
    };
  }, [broadcastId, onBroadcastEnded, token]);

  return {
    error,
    status,
  };
}
