import React from 'react';

import { MentorBoardScreen } from '../../../screens/mentor/MentorBoardScreen';

type Props = {
  mentorToken?: string | null;
  mentorUsername?: string | null;
  onBack?: () => void;
  onCompose?: () => void;
  onOpenPost?: () => void;
  onOpenPrepare?: () => void;
  readOnly?: boolean;
};

const noop = () => undefined;

export function MentorBoardPage({
  mentorToken,
  mentorUsername,
  onBack = noop,
  onCompose = noop,
  onOpenPost = noop,
  onOpenPrepare = noop,
  readOnly,
}: Props): React.JSX.Element {
  return (
    <MentorBoardScreen
      mentorToken={mentorToken}
      mentorUsername={mentorUsername}
      onBack={onBack}
      onCompose={onCompose}
      onOpenPost={onOpenPost}
      onOpenPrepare={onOpenPrepare}
      readOnly={readOnly}
    />
  );
}

export default MentorBoardPage;
