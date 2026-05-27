import { Device } from 'mediasoup-client';
import type { types as mediasoupTypes } from 'mediasoup-client';
import {
  MediaStream,
  registerGlobals,
  RTCAudioSession,
} from 'react-native-webrtc';
import type { MediaStreamTrack } from 'react-native-webrtc';

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
  transport: mediasoupTypes.Transport;
};

export type BroadcastAudioConsumerSession = {
  stop: () => void;
};

export async function startBroadcastAudioConsumer({
  broadcastId,
  onBroadcastEnded,
  token,
}: {
  broadcastId: string;
  onBroadcastEnded?: () => void;
  token: string;
}): Promise<BroadcastAudioConsumerSession> {
  registerGlobals();

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
    });

    const track = consumer.track as unknown as MediaStreamTrack;
    track.enabled = true;
    const stream = new MediaStream([track]);

    consumers.set(producerId, {
      consumer,
      stream,
      transport: recvTransport,
    });

    consumer.on('transportclose', () => {
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
      throw new Error(resumeResponse.error ?? '방송 오디오 재생 실패');
    }
  };

  const handleNewProducer = ({ producerId }: { producerId: string }) => {
    consumeProducer(producerId).catch(() => undefined);
  };
  const handleBroadcastEnded = () => {
    onBroadcastEnded?.();
  };

  socket.on('newProducer', handleNewProducer);
  socket.on('broadcastEnded', handleBroadcastEnded);

  for (const producer of joinResponse.existingProducers ?? []) {
    await consumeProducer(producer.producerId);
  }

  RTCAudioSession.audioSessionDidActivate();

  return {
    stop: () => {
      disposed = true;
      socket.off('newProducer', handleNewProducer);
      socket.off('broadcastEnded', handleBroadcastEnded);
      consumers.forEach(({ consumer, stream, transport }) => {
        consumer.close();
        transport.close();
        stream.release();
      });
      consumers.clear();
      RTCAudioSession.audioSessionDidDeactivate();
    },
  };
}

function getError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error('방송 오디오 수신 중 오류가 발생했습니다.');
}
