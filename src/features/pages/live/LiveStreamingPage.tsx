import React from 'react';

import { LiveStreamingScreen } from '../../screens/viewer/LiveStreamingScreen';
import type { LiveSession } from '../../mocks';

type Props = {
  onBack?: () => void;
  onBroadcastEnded?: () => void;
  session?: LiveSession | null;
  viewerToken?: string | null;
};

const noop = () => undefined;

export function LiveStreamingPage({
  onBack = noop,
  onBroadcastEnded,
  session,
  viewerToken,
}: Props): React.JSX.Element {
  return (
    <LiveStreamingScreen
      onBack={onBack}
      onBroadcastEnded={onBroadcastEnded}
      session={session}
      viewerToken={viewerToken}
    />
  );
}

export default LiveStreamingPage;
