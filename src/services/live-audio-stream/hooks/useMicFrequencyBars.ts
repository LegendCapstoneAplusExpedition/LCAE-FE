import { useEffect, useMemo, useRef, useState } from 'react';
import type { EmitterSubscription } from 'react-native';

import {
  addLiveAudioPcmChunkListener,
  isLiveAudioPcmNativeAvailable,
  startLiveAudioPcmNative,
  stopLiveAudioPcmNative,
} from '../native/LiveAudioPcmNative';
import { base64ToArrayBuffer } from '../utils/base64ToArrayBuffer';

const BAR_COUNT = 20;
const SAMPLE_RATE = 16000;
const CHANNELS = 1;
const CHUNK_DURATION_MS = 100;
const MAX_SAMPLES_PER_FRAME = 1024;
const MIN_FREQUENCY = 85;
const MAX_FREQUENCY = 3600;
const SMOOTHING = 0.68;
const SILENCE_VALUES = Array.from({ length: BAR_COUNT }, () => 0.04);

type LiveAudioPcmEvent = {
  data: string;
  sampleRate?: number;
};

export function useMicFrequencyBars(enabled: boolean): number[] {
  const [bars, setBars] = useState<number[]>(SILENCE_VALUES);
  const barsRef = useRef<number[]>(SILENCE_VALUES);
  const frequencies = useMemo(() => createFrequencyBands(BAR_COUNT), []);

  useEffect(() => {
    if (!enabled || !isLiveAudioPcmNativeAvailable()) {
      barsRef.current = SILENCE_VALUES;
      setBars(SILENCE_VALUES);
      return undefined;
    }

    let disposed = false;
    let subscription: EmitterSubscription | undefined;

    subscription = addLiveAudioPcmChunkListener((event: LiveAudioPcmEvent) => {
      if (disposed) {
        return;
      }

      const nextBars = calculateFrequencyBars({
        base64Pcm: event.data,
        frequencies,
        previousBars: barsRef.current,
        sampleRate: event.sampleRate ?? SAMPLE_RATE,
      });
      barsRef.current = nextBars;
      setBars(nextBars);
    });

    startLiveAudioPcmNative(SAMPLE_RATE, CHANNELS, CHUNK_DURATION_MS).catch(
      () => {
        subscription?.remove();
        subscription = undefined;
      },
    );

    return () => {
      disposed = true;
      subscription?.remove();
      void stopLiveAudioPcmNative();
      barsRef.current = SILENCE_VALUES;
      setBars(SILENCE_VALUES);
    };
  }, [enabled, frequencies]);

  return bars;
}

function createFrequencyBands(count: number): number[] {
  return Array.from({ length: count }, (_, index) => {
    const ratio = count <= 1 ? 0 : index / (count - 1);
    return MIN_FREQUENCY * (MAX_FREQUENCY / MIN_FREQUENCY) ** ratio;
  });
}

function calculateFrequencyBars({
  base64Pcm,
  frequencies,
  previousBars,
  sampleRate,
}: {
  base64Pcm: string;
  frequencies: number[];
  previousBars: number[];
  sampleRate: number;
}): number[] {
  const buffer = base64ToArrayBuffer(base64Pcm);
  const samples = new Int16Array(buffer);
  const sampleCount = Math.min(samples.length, MAX_SAMPLES_PER_FRAME);

  if (sampleCount === 0) {
    return previousBars.map(value => value * SMOOTHING);
  }

  return frequencies.map((frequency, index) => {
    const rawValue = calculateGoertzelMagnitude(
      samples,
      sampleCount,
      frequency,
      sampleRate,
    );
    const normalizedValue = Math.min(1, Math.log10(1 + rawValue * 85));

    return previousBars[index] * SMOOTHING + normalizedValue * (1 - SMOOTHING);
  });
}

function calculateGoertzelMagnitude(
  samples: Int16Array,
  sampleCount: number,
  frequency: number,
  sampleRate: number,
): number {
  const normalizedFrequency = frequency / sampleRate;
  const coefficient = 2 * Math.cos(2 * Math.PI * normalizedFrequency);
  let previous = 0;
  let previous2 = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const sample = samples[index] / 32768;
    const current = sample + coefficient * previous - previous2;
    previous2 = previous;
    previous = current;
  }

  const power =
    previous2 * previous2 + previous * previous - coefficient * previous * previous2;

  return Math.sqrt(Math.max(0, power)) / sampleCount;
}
