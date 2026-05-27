import type {
  LiveAudioChunkHandler,
  LiveAudioChunkSource,
  LiveAudioLevelHandler,
} from '../types';

export class UnsupportedLiveAudioChunkSource implements LiveAudioChunkSource {
  async start(
    _onChunk: LiveAudioChunkHandler,
    _onAudioLevel?: LiveAudioLevelHandler,
  ): Promise<void> {
    throw new Error(
      'Live PCM audio capture is not available on this platform yet.',
    );
  }

  async stop(): Promise<void> {}
}
