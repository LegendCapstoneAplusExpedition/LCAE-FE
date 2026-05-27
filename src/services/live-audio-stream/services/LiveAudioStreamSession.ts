import type {
  LiveAudioChunkSource,
  LiveAudioLevelHandler,
  LiveAudioStreamConfig,
  LiveAudioStreamStartParams,
  LiveAudioTransport,
} from '../types';

export class LiveAudioStreamSession {
  private isStarted = false;

  constructor(
    private readonly config: LiveAudioStreamConfig,
    private readonly source: LiveAudioChunkSource,
    private readonly transport: LiveAudioTransport,
    private readonly onAudioLevel?: LiveAudioLevelHandler,
  ) {}

  async start(params: LiveAudioStreamStartParams): Promise<void> {
    if (this.isStarted) {
      return;
    }

    await this.transport.connect(params);
    this.transport.sendEvent({
      type: 'start',
      liveId: params.liveId,
      memberId: params.memberId,
      format: this.config.format,
      sentAt: Date.now(),
    });

    await this.source.start(
      chunk => {
        this.transport.sendChunk(chunk);
      },
      this.onAudioLevel,
    );

    this.isStarted = true;
  }

  async stop(params: LiveAudioStreamStartParams): Promise<void> {
    if (!this.isStarted) {
      this.transport.close();
      return;
    }

    await this.source.stop();
    this.transport.sendEvent({
      type: 'stop',
      liveId: params.liveId,
      sentAt: Date.now(),
    });
    this.transport.close();
    this.isStarted = false;
  }
}
