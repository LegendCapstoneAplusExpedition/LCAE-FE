import { Device } from 'mediasoup-client';
import type { types as mediasoupTypes } from 'mediasoup-client';
import {
  MediaStream,
  registerGlobals,
} from 'react-native-webrtc';
import type { MediaStreamTrack } from 'react-native-webrtc';

import { prepareReceiveAudioSession } from '../live-audio-stream/native/LiveAudioPcmNative';
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

type JoinBroadcastAck =
  | {
      success: true;
      existingProducers?: Array<{ producerId: string }>;
      rtpCapabilities: mediasoupTypes.RtpCapabilities;
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

type ConsumeAck =
  | {
      success: true;
      id: string;
      kind: mediasoupTypes.MediaKind;
      producerId: string;
      rtpParameters: mediasoupTypes.RtpParameters;
    }
  | {
      success: false;
      error?: string;
    };

type ConsumerEntry = {
  consumer: mediasoupTypes.Consumer;
  stream: MediaStream;
  stopPlaybackSessionRefresh: () => void;
  transport: mediasoupTypes.Transport;
};

export type BroadcastAudioConsumerSession = {
  stop: () => void;
};

export async function startBroadcastAudioConsumer({
  broadcastId,
  onBroadcastEnded,
  onError,
  token,
}: {
  broadcastId: string;
  onBroadcastEnded?: () => void;
  onError?: (error: Error) => void;
  token: string;
}): Promise<BroadcastAudioConsumerSession> {
  registerGlobals();
  await prepareReceiveAudioSession();

  const socket = await getConnectedBroadcastSocket(token);
  const device = new Device({ handlerName: 'ReactNative106' });
  const consumers = new Map<string, ConsumerEntry>();
  let disposed = false;

  const joinResponse = await emitBroadcastSocketWithAck<JoinBroadcastAck>(
    socket,
    'joinBroadcast',
    { broadcastId },
  );

  if (!joinResponse.success) {
    throw new Error(joinResponse.error ?? '방송 청취방 입장에 실패했습니다.');
  }

  await device.load({
    routerRtpCapabilities: joinResponse.rtpCapabilities,
  });

  const consumeProducer = async (producerId: string) => {
    if (disposed || consumers.has(producerId)) {
      return;
    }

    await prepareReceiveAudioSession();

    const transportResponse =
      await emitBroadcastSocketWithAck<CreateTransportAck>(
        socket,
        'createWebRtcTransport',
        { broadcastId },
      );

    if (!transportResponse.success) {
      throw new Error(
        transportResponse.error ?? '수신 전송 채널 생성에 실패했습니다.',
      );
    }

    const recvTransport = device.createRecvTransport(transportResponse.params);
    const streamId = `broadcast-${broadcastId}-${producerId}`;

    recvTransport.on('connectionstatechange', state => {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.info(
          `[broadcast-audio] recv transport ${state} [producer:${producerId}]`,
        );
      }
    });

    recvTransport.on('connect', ({ dtlsParameters }, callback, errback) => {
      emitBroadcastSocketWithAck<SocketAck>(socket, 'connectWebRtcTransport', {
        broadcastId,
        dtlsParameters,
        transportId: recvTransport.id,
      })
        .then(response => {
          if (response.success) {
            callback();
            return;
          }

          errback(new Error(response.error ?? '수신 전송 채널 연결 실패'));
        })
        .catch(error => {
          errback(getError(error));
        });
    });

    const consumeResponse = await emitBroadcastSocketWithAck<ConsumeAck>(
      socket,
      'consume',
      {
        broadcastId,
        producerId,
        rtpCapabilities: device.rtpCapabilities,
        transportId: recvTransport.id,
      },
    );

    if (!consumeResponse.success) {
      recvTransport.close();
      throw new Error(consumeResponse.error ?? '방송 오디오 수신 실패');
    }

    const consumer = await recvTransport.consume({
      id: consumeResponse.id,
      kind: consumeResponse.kind,
      producerId: consumeResponse.producerId,
      rtpParameters: consumeResponse.rtpParameters,
      streamId,
    });

    const track = consumer.track as unknown as MediaStreamTrack;
    track.enabled = true;
    setRemoteAudioTrackVolume(track);
    const stream = new MediaStream([track]);

    const entry: ConsumerEntry = {
      consumer,
      stream,
      stopPlaybackSessionRefresh: () => undefined,
      transport: recvTransport,
    };

    consumers.set(producerId, entry);

    consumer.on('transportclose', () => {
      consumers.delete(producerId);
    });
    const producerCloseAwareConsumer = consumer as mediasoupTypes.Consumer & {
      on(event: 'producerclose', listener: () => void): void;
    };
    producerCloseAwareConsumer.on('producerclose', () => {
      entry.stopPlaybackSessionRefresh();
      consumer.close();
      recvTransport.close();
      stream.release();
      consumers.delete(producerId);
    });

    const resumeResponse = await emitBroadcastSocketWithAck<SocketAck>(
      socket,
      'resumeConsumer',
      {
        broadcastId,
        consumerId: consumer.id,
      },
    );

    if (!resumeResponse.success) {
      consumer.close();
      recvTransport.close();
      stream.release();
      consumers.delete(producerId);
      throw new Error(resumeResponse.error ?? '방송 오디오 재생 실패');
    }

    consumer.resume();
    track.enabled = true;
    await prepareReceiveAudioSession();
    setRemoteAudioTrackVolume(track);
    const stopPlaybackSessionRefresh = scheduleReceiveSessionRefresh();
    const stopReceiverStatsLogging = startReceiverStatsLogging(
      consumer,
      producerId,
    );
    entry.stopPlaybackSessionRefresh = () => {
      stopPlaybackSessionRefresh();
      stopReceiverStatsLogging();
    };
  };

  const handleNewProducer = ({ producerId }: { producerId: string }) => {
    consumeProducer(producerId).catch(error => {
      if (disposed) {
        return;
      }

      onError?.(getError(error));
    });
  };
  const handleBroadcastEnded = () => {
    onBroadcastEnded?.();
  };

  socket.on('newProducer', handleNewProducer);
  socket.on('broadcastEnded', handleBroadcastEnded);

  for (const producer of joinResponse.existingProducers ?? []) {
    await consumeProducer(producer.producerId);
  }

  return {
    stop: () => {
      disposed = true;
      socket.off('newProducer', handleNewProducer);
      socket.off('broadcastEnded', handleBroadcastEnded);
      consumers.forEach(
        ({ consumer, stopPlaybackSessionRefresh, stream, transport }) => {
          stopPlaybackSessionRefresh();
          consumer.close();
          transport.close();
          stream.release();
        },
      );
      consumers.clear();
    },
  };
}

function scheduleReceiveSessionRefresh(): () => void {
  const timeoutIds = [120, 350, 800, 1600].map(delay =>
    setTimeout(() => {
      prepareReceiveAudioSession().catch(() => undefined);
    }, delay),
  );

  return () => {
    timeoutIds.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
  };
}

function startReceiverStatsLogging(
  consumer: mediasoupTypes.Consumer,
  producerId: string,
): () => void {
  if (typeof __DEV__ === 'undefined' || !__DEV__) {
    return () => undefined;
  }

  let disposed = false;
  let previousBytesReceived = 0;
  let previousPacketsReceived = 0;

  const intervalId = setInterval(() => {
    consumer
      .getStats()
      .then(stats => {
        if (disposed) {
          return;
        }

        const inboundAudioStats = getInboundAudioStats(stats);

        if (!inboundAudioStats) {
          return;
        }

        const bytesReceived = getNumberStat(inboundAudioStats, 'bytesReceived');
        const packetsReceived = getNumberStat(
          inboundAudioStats,
          'packetsReceived',
        );

        if (
          bytesReceived === previousBytesReceived &&
          packetsReceived === previousPacketsReceived
        ) {
          console.info(
            `[broadcast-audio] no inbound RTP yet [producer:${producerId}]`,
          );
          return;
        }

        previousBytesReceived = bytesReceived;
        previousPacketsReceived = packetsReceived;
        console.info(
          `[broadcast-audio] inbound RTP [producer:${producerId}, packets:${packetsReceived}, bytes:${bytesReceived}]`,
        );
      })
      .catch(() => undefined);
  }, 1500);

  return () => {
    disposed = true;
    clearInterval(intervalId);
  };
}

function setRemoteAudioTrackVolume(track: MediaStreamTrack): void {
  const volumeAwareTrack = track as MediaStreamTrack & {
    _setVolume?: (volume: number) => void;
  };

  volumeAwareTrack._setVolume?.(10);
}

function getInboundAudioStats(stats: unknown): Record<string, unknown> | null {
  const values =
    stats instanceof Map
      ? Array.from(stats.values())
      : typeof stats === 'object' && stats !== null
        ? Object.values(stats)
        : [];

  for (const value of values) {
    if (!isRecord(value)) {
      continue;
    }

    if (
      value.type === 'inbound-rtp' &&
      (value.kind === 'audio' || value.mediaType === 'audio')
    ) {
      return value;
    }
  }

  return null;
}

function getNumberStat(
  stats: Record<string, unknown>,
  key: string,
): number {
  const value = stats[key];

  return typeof value === 'number' ? value : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('방송 오디오 수신 중 오류가 발생했습니다.');
}
