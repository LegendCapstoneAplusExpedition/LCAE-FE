import React from 'react';

import { LivePrepareScreen } from '../../../screens/mentor/LivePrepareScreen';

type Props = {
  onBack?: () => void;
  onStart?: (title: string) => Promise<void> | void;
  onOpenBoard?: () => void;
  onOpenReplay?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastCreatePage({
  onBack = noop,
  onStart = noop,
  onOpenBoard = noop,
  onOpenReplay = noop,
}: Props): React.JSX.Element {
  return (
    <LivePrepareScreen
      onBack={onBack}
      onOpenBoard={onOpenBoard}
      onOpenReplay={onOpenReplay}
      onStart={onStart}
    />
  );
}

export default MentorBroadcastCreatePage;
