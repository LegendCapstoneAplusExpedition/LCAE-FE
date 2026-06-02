import React from 'react';

import {
  LiveBroadcastSummaryScreen,
  type LiveBroadcastSummary,
} from '../../../screens/mentor/LiveBroadcastSummaryScreen';

type Props = {
  onExit?: () => void;
  summary?: LiveBroadcastSummary | null;
};

const noop = () => undefined;

export function MentorBroadcastSummaryPage({
  onExit = noop,
  summary,
}: Props): React.JSX.Element {
  return (
    <LiveBroadcastSummaryScreen onExit={onExit} summary={summary} />
  );
}

export default MentorBroadcastSummaryPage;
