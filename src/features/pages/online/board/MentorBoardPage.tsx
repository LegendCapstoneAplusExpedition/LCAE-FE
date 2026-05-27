import React from 'react';

import { MentorBoardScreen } from '../../../screens/mentor/MentorBoardScreen';

type Props = {
  mentorToken?: string | null;
  onBack?: () => void;
  onCompose?: () => void;
  onOpenPost?: () => void;
  onOpenPrepare?: () => void;
  onOpenReplay?: () => void;
};

const noop = () => undefined;

export function MentorBoardPage({
  mentorToken,
  onBack = noop,
  onCompose = noop,
  onOpenPost = noop,
  onOpenPrepare = noop,
  onOpenReplay = noop,
}: Props): React.JSX.Element {
  return (
    <MentorBoardScreen
      mentorToken={mentorToken}
      onBack={onBack}
      onCompose={onCompose}
      onOpenPost={onOpenPost}
      onOpenPrepare={onOpenPrepare}
      onOpenReplay={onOpenReplay}
    />
  );
}

export default MentorBoardPage;
