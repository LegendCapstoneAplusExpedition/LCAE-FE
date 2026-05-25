export type LiveAudioStreamStatus =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'stopping'
  | 'error';

export type LiveAudioEncoding = 'pcm16';

export type LiveAudioFormat = {
  encoding: LiveAudioEncoding;
  sampleRate: number;
  channels: 1 | 2;
  bitsPerSample: 16;
};

export type LiveAudioChunk = {
  data: ArrayBuffer;
  sequence: number;
  timestamp: number;
  format: LiveAudioFormat;
};

export type LiveAudioStreamStartParams = {
  liveId: string;
  memberId?: string;
  authToken?: string;
};

export type LiveAudioStreamConfig = {
  websocketUrl?: string;
  format: LiveAudioFormat;
};

export type LiveAudioStreamEvent =
  | {
      type: 'start';
      liveId: string;
      memberId?: string;
      format: LiveAudioFormat;
      sentAt: number;
    }
  | {
      type: 'stop';
      liveId: string;
      sentAt: number;
    };

export type LiveAudioChunkHandler = (chunk: LiveAudioChunk) => void;
export type LiveAudioLevelHandler = (db: number) => void;

export type LiveAudioChunkSource = {
  start: (
    onChunk: LiveAudioChunkHandler,
    onAudioLevel?: LiveAudioLevelHandler,
  ) => Promise<void>;
  stop: () => Promise<void>;
};

export type LiveAudioTransport = {
  connect: (params: LiveAudioStreamStartParams) => Promise<void>;
  sendEvent: (event: LiveAudioStreamEvent) => void;
  sendChunk: (chunk: LiveAudioChunk) => void;
  close: () => void;
};
