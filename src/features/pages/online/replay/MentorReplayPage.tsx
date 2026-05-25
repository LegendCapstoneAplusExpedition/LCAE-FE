import React from 'react';

import { MentorReplayManageScreen } from '../../../screens/mentor/MentorReplayManageScreen';

type Props = {
  onBack?: () => void;
  onOpenBoard?: () => void;
  onOpenLive?: () => void;
};

const noop = () => undefined;

export function MentorReplayPage({
  onBack = noop,
  onOpenBoard = noop,
  onOpenLive = noop,
}: Props): React.JSX.Element {
  return (
    <MentorReplayManageScreen
      onBack={onBack}
      onOpenBoard={onOpenBoard}
      onOpenLive={onOpenLive}
    />
  );
}

export default MentorReplayPage;
