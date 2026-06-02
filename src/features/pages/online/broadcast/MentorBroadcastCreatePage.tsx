import React from 'react';

import { LivePrepareScreen } from '../../../screens/mentor/LivePrepareScreen';

type Props = {
  onBack?: () => void;
  onStart?: (title: string) => Promise<void> | void;
  onOpenBoard?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastCreatePage({
  onBack = noop,
  onStart = noop,
  onOpenBoard = noop,
}: Props): React.JSX.Element {
  return (
    <LivePrepareScreen
      onBack={onBack}
      onOpenBoard={onOpenBoard}
      onStart={onStart}
    />
  );
}

export default MentorBroadcastCreatePage;
