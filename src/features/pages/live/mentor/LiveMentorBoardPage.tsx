import React from 'react';

import { MentorBoardScreen } from '../../../screens/mentor/MentorBoardScreen';

type Props = {
  mentorUsername?: string | null;
  onBack?: () => void;
  onCompose?: () => void;
  onOpenPost?: () => void;
  onOpenPrepare?: () => void;
  viewerToken?: string | null;
};

const noop = () => undefined;

export function LiveMentorBoardPage({
  mentorUsername,
  onBack = noop,
  onCompose = noop,
  onOpenPost = noop,
  onOpenPrepare = noop,
  viewerToken,
}: Props): React.JSX.Element {
  return (
    <MentorBoardScreen
      mentorUsername={mentorUsername}
      onBack={onBack}
      onCompose={onCompose}
      onOpenPost={onOpenPost}
      onOpenPrepare={onOpenPrepare}
      readOnly
      viewerToken={viewerToken}
    />
  );
}

export default LiveMentorBoardPage;
