import type { EmitterSubscription } from 'react-native';

import {
  addLiveAudioPcmChunkListener,
  startLiveAudioPcmNative,
  stopLiveAudioPcmNative,
} from '../native/LiveAudioPcmNative';
import type {
  LiveAudioChunkHandler,
  LiveAudioChunkSource,
  LiveAudioLevelHandler,
  LiveAudioStreamConfig,
} from '../types';
import { base64ToArrayBuffer } from '../utils/base64ToArrayBuffer';

const CHUNK_DURATION_MS = 100;

type LiveAudioPcmEvent = {
  data: string;
  sequence: number;
  timestamp: number;
  db?: number;
};

export class IosLiveAudioChunkSource implements LiveAudioChunkSource {
  private subscription?: EmitterSubscription;

  constructor(private readonly config: LiveAudioStreamConfig) {}

  async start(
    onChunk: LiveAudioChunkHandler,
    onAudioLevel?: LiveAudioLevelHandler,
  ): Promise<void> {
    this.subscription?.remove();
    this.subscription = addLiveAudioPcmChunkListener(
      (event: LiveAudioPcmEvent) => {
        if (typeof event.db === 'number') {
          onAudioLevel?.(event.db);
        }

        onChunk({
          data: base64ToArrayBuffer(event.data),
          sequence: event.sequence,
          timestamp: event.timestamp,
          format: this.config.format,
        });
      },
    );

    await startLiveAudioPcmNative(
      this.config.format.sampleRate,
      this.config.format.channels,
      CHUNK_DURATION_MS,
    );
  }

  async stop(): Promise<void> {
    this.subscription?.remove();
    this.subscription = undefined;
    await stopLiveAudioPcmNative();
  }
}
