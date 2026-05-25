import { IosLiveAudioChunkSource } from './IosLiveAudioChunkSource';
import { UnsupportedLiveAudioChunkSource } from './UnsupportedLiveAudioChunkSource';
import { isLiveAudioPcmNativeAvailable } from '../native/LiveAudioPcmNative';
import type { LiveAudioChunkSource, LiveAudioStreamConfig } from '../types';

export function createLiveAudioChunkSource(
  config: LiveAudioStreamConfig,
): LiveAudioChunkSource {
  if (isLiveAudioPcmNativeAvailable()) {
    return new IosLiveAudioChunkSource(config);
  }

  return new UnsupportedLiveAudioChunkSource();
}
