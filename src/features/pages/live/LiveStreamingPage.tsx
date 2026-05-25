import React from 'react';

import { LiveStreamingScreen } from '../../screens/viewer/LiveStreamingScreen';

type Props = {
  onBack?: () => void;
};

const noop = () => undefined;

export function LiveStreamingPage({ onBack = noop }: Props): React.JSX.Element {
  return <LiveStreamingScreen onBack={onBack} />;
}

export default LiveStreamingPage;
