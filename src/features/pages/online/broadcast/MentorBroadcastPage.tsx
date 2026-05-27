import React from 'react';

import { LiveBroadcastScreen } from '../../../screens/mentor/LiveBroadcastScreen';
import type { BroadcastSession } from '../../../../services/socket/broadcastSocket';

type Props = {
  mentorToken?: string | null;
  onEnd?: () => void;
  session?: BroadcastSession | null;
};

const noop = () => undefined;

export function MentorBroadcastPage({
  mentorToken,
  onEnd = noop,
  session,
}: Props): React.JSX.Element {
  return (
    <LiveBroadcastScreen
      mentorToken={mentorToken}
      onEnd={onEnd}
      session={session}
    />
  );
}

export default MentorBroadcastPage;
