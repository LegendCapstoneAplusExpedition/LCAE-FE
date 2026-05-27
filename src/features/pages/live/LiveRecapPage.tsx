import React from 'react';

import { ReplayScreen } from '../../screens/viewer/ReplayScreen';

type Props = {
  onBack?: () => void;
};

const noop = () => undefined;

export function LiveRecapPage({ onBack = noop }: Props): React.JSX.Element {
  return <ReplayScreen recap onBack={onBack} />;
}

export default LiveRecapPage;
