import React from 'react';

import { LiveBroadcastScreen } from '../../../screens/mentor/LiveBroadcastScreen';

type Props = {
  onBack?: () => void;
  onEnd?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastPage({
  onBack = noop,
  onEnd = noop,
}: Props): React.JSX.Element {
  return <LiveBroadcastScreen onBack={onBack} onEnd={onEnd} />;
}

export default MentorBroadcastPage;
