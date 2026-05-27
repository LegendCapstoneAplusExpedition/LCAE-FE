import React from 'react';

import { ReplayScreen } from '../../../screens/viewer/ReplayScreen';

type Props = {
  onBack?: () => void;
};

const noop = () => undefined;

export function LiveMentorReplayPage({
  onBack = noop,
}: Props): React.JSX.Element {
  return <ReplayScreen onBack={onBack} />;
}

export default LiveMentorReplayPage;
