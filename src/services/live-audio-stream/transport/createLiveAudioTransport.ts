import { LiveAudioWebSocketTransport } from './LiveAudioWebSocketTransport';
import type { LiveAudioStreamConfig, LiveAudioTransport } from '../types';

export function createLiveAudioTransport(
  config: LiveAudioStreamConfig,
): LiveAudioTransport {
  return new LiveAudioWebSocketTransport(config);
}
