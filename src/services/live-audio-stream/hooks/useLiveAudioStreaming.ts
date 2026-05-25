import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import { LIVE_AUDIO_STREAM_CONFIG } from '../config/liveAudioStreamConfig';
import { LiveAudioStreamSession } from '../services/LiveAudioStreamSession';
import { createLiveAudioChunkSource } from '../sources/createLiveAudioChunkSource';
import { createLiveAudioTransport } from '../transport/createLiveAudioTransport';
import type {
  LiveAudioStreamConfig,
  LiveAudioLevelHandler,
  LiveAudioStreamStartParams,
  LiveAudioStreamStatus,
} from '../types';

type Options = {
  enabled?: boolean;
  params: LiveAudioStreamStartParams;
  config?: LiveAudioStreamConfig;
  onAudioLevel?: LiveAudioLevelHandler;
};

type Result = {
  status: LiveAudioStreamStatus;
  errorMessage?: string;
  start: () => Promise<void>;
  stop: () => Promise<void>;
};

export function useLiveAudioStreaming({
  enabled = false,
  params,
  config = LIVE_AUDIO_STREAM_CONFIG,
  onAudioLevel,
}: Options): Result {
  const [status, setStatus] = useState<LiveAudioStreamStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();
  const sessionRef = useRef<LiveAudioStreamSession | undefined>(undefined);

  const getSession = useCallback(() => {
    if (!sessionRef.current) {
      sessionRef.current = new LiveAudioStreamSession(
        config,
        createLiveAudioChunkSource(config),
        createLiveAudioTransport(config),
        onAudioLevel,
      );
    }

    return sessionRef.current;
  }, [config, onAudioLevel]);

  const stop = useCallback(async () => {
    setStatus('stopping');

    try {
      await sessionRef.current?.stop(params);
      sessionRef.current = undefined;
      setStatus('idle');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setStatus('error');
    }
  }, [params]);

  const start = useCallback(async () => {
    setErrorMessage(undefined);
    setStatus('connecting');

    try {
      const hasPermission = await requestMicPermission();

      if (!hasPermission) {
        throw new Error('Microphone permission is required for live audio.');
      }

      await getSession().start(params);
      setStatus('streaming');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      sessionRef.current?.stop(params).catch(() => undefined);
      sessionRef.current = undefined;
      setStatus('error');
    }
  }, [getSession, params]);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    start();

    return () => {
      stop();
    };
  }, [enabled, start, stop]);

  return {
    status,
    errorMessage,
    start,
    stop,
  };
}

async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    {
      title: '마이크 권한',
      message: '라이브 음성 송출을 위해 마이크 권한이 필요합니다.',
      buttonNegative: '취소',
      buttonPositive: '확인',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Live audio streaming failed.';
}
