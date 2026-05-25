import type { LiveAudioStreamConfig } from '../types';

export const LIVE_AUDIO_STREAM_CONFIG: LiveAudioStreamConfig = {
  websocketUrl: undefined,
  format: {
    encoding: 'pcm16',
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
  },
};
