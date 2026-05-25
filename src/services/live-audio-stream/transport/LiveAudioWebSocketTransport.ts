import type {
  LiveAudioChunk,
  LiveAudioStreamConfig,
  LiveAudioStreamEvent,
  LiveAudioStreamStartParams,
  LiveAudioTransport,
} from '../types';

const OPEN_STATE = 1;

export class LiveAudioWebSocketTransport implements LiveAudioTransport {
  private socket: WebSocket | null = null;

  constructor(private readonly config: LiveAudioStreamConfig) {}

  connect(params: LiveAudioStreamStartParams): Promise<void> {
    const { websocketUrl } = this.config;

    if (!websocketUrl) {
      return Promise.reject(new Error('Live audio websocketUrl is not set.'));
    }

    const socketUrl = buildSocketUrl(websocketUrl, params);
    const socket = new WebSocket(socketUrl);
    socket.binaryType = 'arraybuffer';
    this.socket = socket;

    return new Promise((resolve, reject) => {
      socket.onopen = () => resolve();
      socket.onerror = () => {
        reject(new Error('Live audio WebSocket connection failed.'));
      };
    });
  }

  sendEvent(event: LiveAudioStreamEvent): void {
    const socket = this.getOpenSocket();

    socket.send(JSON.stringify(event));
  }

  sendChunk(chunk: LiveAudioChunk): void {
    const socket = this.getOpenSocket();
    const header = JSON.stringify({
      type: 'audio',
      sequence: chunk.sequence,
      timestamp: chunk.timestamp,
      format: chunk.format,
    });

    socket.send(header);
    socket.send(chunk.data);
  }

  close(): void {
    this.socket?.close();
    this.socket = null;
  }

  private getOpenSocket(): WebSocket {
    if (!this.socket || this.socket.readyState !== OPEN_STATE) {
      throw new Error('Live audio WebSocket is not open.');
    }

    return this.socket;
  }
}

function buildSocketUrl(
  websocketUrl: string,
  params: LiveAudioStreamStartParams,
): string {
  const separator = websocketUrl.includes('?') ? '&' : '?';
  const query = [`liveId=${encodeURIComponent(params.liveId)}`];

  if (params.memberId) {
    query.push(`memberId=${encodeURIComponent(params.memberId)}`);
  }

  if (params.authToken) {
    query.push(`token=${encodeURIComponent(params.authToken)}`);
  }

  return `${websocketUrl}${separator}${query.join('&')}`;
}
