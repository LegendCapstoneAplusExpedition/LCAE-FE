import { Device } from 'mediasoup-client';
import type { types as mediasoupTypes } from 'mediasoup-client';
import {
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';
import type { MediaStream } from 'react-native-webrtc';

import { prepareWebRtcAudioSession } from '../live-audio-stream/native/LiveAudioPcmNative';
import {
  emitBroadcastSocketWithAck,
  getConnectedBroadcastSocket,
} from './broadcastSocket';

type SocketAck =
  | {
      success: true;
    }
  | {
      success: false;
      error?: string;
    };

type CreateTransportAck =
  | {
      success: true;
      params: mediasoupTypes.TransportOptions;
    }
  | {
      success: false;
      error?: string;
    };

type ProduceAck =
  | {
      success: true;
      producerId: string;
    }
  | {
      success: false;
      error?: string;
    };

export type BroadcastAudioProducerSession = {
  stop: () => void;
};

type AudioLevelHandler = (level: number) => void;

export async function startBroadcastAudioProducer({
  broadcastId,
  onAudioLevel,
  routerRtpCapabilities,
  token,
}: {
  broadcastId: string;
  onAudioLevel?: AudioLevelHandler;
  routerRtpCapabilities: unknown;
  token: string;
}): Promise<BroadcastAudioProducerSession> {
  registerGlobals();

  if (!routerRtpCapabilities) {
    throw new Error('방송 음성 엔진 정보가 없습니다.');
  }

  await prepareWebRtcAudioSession();

  const stream = (await mediaDevices.getUserMedia({
    audio: true,
    video: false,
  })) as MediaStream;
  const track = stream.getAudioTracks()[0];

  if (!track) {
    closeStream(stream);
    throw new Error('마이크 오디오 트랙을 찾지 못했습니다.');
  }

  track.enabled = true;

  try {
    const socket = await getConnectedBroadcastSocket(token);
    const device = new Device({ handlerName: 'ReactNative106' });

    await device.load({
      routerRtpCapabilities:
        routerRtpCapabilities as mediasoupTypes.RtpCapabilities,
    });

    if (!device.canProduce('audio')) {
      throw new Error('이 기기에서 오디오 송출을 시작할 수 없습니다.');
    }

    const transportResponse =
      await emitBroadcastSocketWithAck<CreateTransportAck>(
        socket,
        'createWebRtcTransport',
        { broadcastId },
      );

    if (!transportResponse.success) {
      throw new Error(transportResponse.error ?? '송출 전송 채널 생성 실패');
    }

    const sendTransport = device.createSendTransport(transportResponse.params);

    sendTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      emitBroadcastSocketWithAck<SocketAck>(socket, 'connectWebRtcTransport', {
        broadcastId,
        dtlsParameters,
        transportId: sendTransport.id,
      })
        .then(response => {
          if (response.success) {
            callback();
            return;
          }

          errback(new Error(response.error ?? '송출 전송 채널 연결 실패'));
        })
        .catch(error => {
          errback(getError(error));
        });
    });

    sendTransport.on('produce', ({ kind, rtpParameters }, callback, errback) => {
      emitBroadcastSocketWithAck<ProduceAck>(socket, 'produce', {
        broadcastId,
        kind,
        rtpParameters,
        transportId: sendTransport.id,
      })
        .then(response => {
          if (response.success) {
            callback({ id: response.producerId });
            return;
          }

          errback(new Error(response.error ?? '오디오 송출 시작 실패'));
        })
        .catch(error => {
          errback(getError(error));
        });
    });

    const producer = await sendTransport.produce({
      track: track as unknown as MediaStreamTrack,
    });
    const stopAudioLevelPolling = startAudioLevelPolling(
      producer,
      onAudioLevel,
    );

    return {
      stop: () => {
        stopAudioLevelPolling();
        producer.close();
        sendTransport.close();
        closeStream(stream);
      },
    };
  } catch (error) {
    closeStream(stream);
    throw error;
  }
}

function closeStream(stream: MediaStream): void {
  stream.getTracks().forEach(track => {
    track.stop();
  });
}

function getError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('방송 오디오 송출 중 오류가 발생했습니다.');
}

function startAudioLevelPolling(
  producer: mediasoupTypes.Producer,
  onAudioLevel?: AudioLevelHandler,
): () => void {
  if (!onAudioLevel) {
    return () => undefined;
  }

  let previousEnergy: number | undefined;
  let previousDuration: number | undefined;
  let disposed = false;

  const intervalId = setInterval(() => {
    producer
      .getStats()
      .then(stats => {
        if (disposed) {
          return;
        }

        const level = getAudioLevelFromStats(stats, {
          previousDuration,
          previousEnergy,
        });

        previousEnergy = level.totalAudioEnergy;
        previousDuration = level.totalSamplesDuration;
        onAudioLevel(level.value);
      })
      .catch(() => undefined);
  }, 180);

  return () => {
    disposed = true;
    clearInterval(intervalId);
    onAudioLevel(0);
  };
}

function getAudioLevelFromStats(
  stats: RTCStatsReport,
  previous: {
    previousDuration?: number;
    previousEnergy?: number;
  },
): {
  audioLevel?: number;
  totalAudioEnergy?: number;
  totalSamplesDuration?: number;
  value: number;
} {
  let audioLevel: number | undefined;
  let totalAudioEnergy: number | undefined;
  let totalSamplesDuration: number | undefined;

  stats.forEach(report => {
    const candidate = report as {
      audioLevel?: number;
      kind?: string;
      mediaType?: string;
      totalAudioEnergy?: number;
      totalSamplesDuration?: number;
      type?: string;
    };
    const reportType = candidate.type ?? 'unknown';
    const isAudio =
      candidate.kind === 'audio' ||
      candidate.mediaType === 'audio' ||
      reportType === 'outbound-rtp' ||
      candidate.type === 'media-source';

    if (!isAudio) {
      return;
    }

    if (typeof candidate.audioLevel === 'number') {
      audioLevel = Math.max(audioLevel ?? 0, candidate.audioLevel);
    }

    if (
      typeof candidate.totalAudioEnergy === 'number' &&
      typeof candidate.totalSamplesDuration === 'number'
    ) {
      totalAudioEnergy = candidate.totalAudioEnergy;
      totalSamplesDuration = candidate.totalSamplesDuration;
    }
  });

  if (
    totalAudioEnergy !== undefined &&
    totalSamplesDuration !== undefined &&
    previous.previousEnergy !== undefined &&
    previous.previousDuration !== undefined
  ) {
    const energyDelta = totalAudioEnergy - previous.previousEnergy;
    const durationDelta = totalSamplesDuration - previous.previousDuration;

    if (energyDelta > 0 && durationDelta > 0) {
      return {
        audioLevel,
        totalAudioEnergy,
        totalSamplesDuration,
        value: Math.min(1, Math.sqrt(energyDelta / durationDelta) * 4),
      };
    }
  }

  if (audioLevel !== undefined) {
    return {
      audioLevel,
      totalAudioEnergy,
      totalSamplesDuration,
      value: Math.max(0, Math.min(1, audioLevel * 8)),
    };
  }

  return {
    audioLevel,
    totalAudioEnergy,
    totalSamplesDuration,
    value: 0,
  };
}
