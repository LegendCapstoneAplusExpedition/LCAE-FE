import React from 'react';

import {
  LivePrepareScreen,
  type LivePrepareDraft,
} from '../../../screens/mentor/LivePrepareScreen';

type Props = {
  mentorUsername?: string | null;
  onBack?: () => void;
  onStart?: (draft: LivePrepareDraft) => Promise<void> | void;
  onOpenBoard?: () => void;
};

const noop = () => undefined;

export function MentorBroadcastCreatePage({
  mentorUsername,
  onBack = noop,
  onStart = noop,
  onOpenBoard = noop,
}: Props): React.JSX.Element {
  return (
    <LivePrepareScreen
      mentorUsername={mentorUsername}
      onBack={onBack}
      onOpenBoard={onOpenBoard}
      onStart={onStart}
    />
  );
}

export default MentorBroadcastCreatePage;
