import React from 'react';

import { LiveListScreen } from '../../screens/viewer/LiveListScreen';
import type { LiveSession } from '../../mocks';

type Props = {
  authToken?: string | null;
  onOpenLive?: (session?: LiveSession) => void;
  onOpenLogin?: () => void;
  onOpenMentor?: () => void;
  onOpenMy?: () => void;
};

const noop = () => undefined;

export function LiveListPage({
  authToken,
  onOpenLive = noop,
  onOpenLogin = noop,
  onOpenMentor = noop,
  onOpenMy = noop,
}: Props): React.JSX.Element {
  return (
    <LiveListScreen
      authToken={authToken}
      initialTab="all"
      onOpenLive={onOpenLive}
      onOpenLogin={onOpenLogin}
      onOpenMentor={onOpenMentor}
      onOpenMy={onOpenMy}
    />
  );
}

export default LiveListPage;
