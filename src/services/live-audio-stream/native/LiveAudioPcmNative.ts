import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import type { EmitterSubscription } from 'react-native';

export const LIVE_AUDIO_PCM_CHUNK_EVENT = 'LiveAudioPcmChunk';

type LiveAudioPcmEvent = {
  data: string;
  sequence: number;
  timestamp: number;
  sampleRate: number;
  channels: number;
  db?: number;
};

type LiveAudioPcmNativeModule = {
  preparePlaybackAudioSession?: () => Promise<Record<string, unknown>>;
  prepareReceiveAudioSession?: () => Promise<Record<string, unknown>>;
  prepareWebRtcAudioSession?: () => Promise<Record<string, unknown>>;
  start: (
    sampleRate: number,
    channels: number,
    chunkDurationMs: number,
  ) => Promise<void>;
  stop: () => Promise<void>;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
};

const nativeModule = NativeModules.LiveAudioPcm as
  | LiveAudioPcmNativeModule
  | undefined;
const eventEmitter = nativeModule
  ? new NativeEventEmitter(nativeModule)
  : undefined;

export function isLiveAudioPcmNativeAvailable(): boolean {
  return Platform.OS === 'ios' && Boolean(nativeModule);
}

export function startLiveAudioPcmNative(
  sampleRate: number,
  channels: number,
  chunkDurationMs: number,
): Promise<void> {
  if (!nativeModule) {
    return Promise.reject(
      new Error('LiveAudioPcm native module is not available.'),
    );
  }

  return nativeModule.start(sampleRate, channels, chunkDurationMs);
}

export function stopLiveAudioPcmNative(): Promise<void> {
  if (!nativeModule) {
    return Promise.resolve();
  }

  return nativeModule.stop();
}

export function prepareWebRtcAudioSession(): Promise<Record<string, unknown>> {
  if (!nativeModule?.prepareWebRtcAudioSession) {
    return Promise.resolve({});
  }

  return nativeModule.prepareWebRtcAudioSession();
}

export function preparePlaybackAudioSession(): Promise<Record<string, unknown>> {
  if (!nativeModule?.preparePlaybackAudioSession) {
    return Promise.resolve({});
  }

  return nativeModule.preparePlaybackAudioSession();
}

export function prepareReceiveAudioSession(): Promise<Record<string, unknown>> {
  if (!nativeModule?.prepareReceiveAudioSession) {
    return Promise.resolve({});
  }

  return nativeModule.prepareReceiveAudioSession();
}

export function addLiveAudioPcmChunkListener(
  listener: (event: LiveAudioPcmEvent) => void,
): EmitterSubscription {
  if (!eventEmitter) {
    throw new Error('LiveAudioPcm native module is not available.');
  }

  return eventEmitter.addListener(LIVE_AUDIO_PCM_CHUNK_EVENT, listener);
}
