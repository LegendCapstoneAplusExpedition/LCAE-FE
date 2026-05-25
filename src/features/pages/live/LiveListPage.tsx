import React from 'react';

import { LiveListScreen } from '../../screens/viewer/LiveListScreen';

type Props = {
  onOpenLive?: () => void;
  onOpenMentor?: () => void;
  onOpenMy?: () => void;
};

const noop = () => undefined;

export function LiveListPage({
  onOpenLive = noop,
  onOpenMentor = noop,
  onOpenMy = noop,
}: Props): React.JSX.Element {
  return (
    <LiveListScreen
      initialTab="all"
      onOpenLive={onOpenLive}
      onOpenMentor={onOpenMentor}
      onOpenMy={onOpenMy}
    />
  );
}

export default LiveListPage;
