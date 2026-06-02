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

export function LiveSubPage({
  authToken,
  onOpenLive = noop,
  onOpenLogin = noop,
  onOpenMentor = noop,
  onOpenMy = noop,
}: Props): React.JSX.Element {
  return (
    <LiveListScreen
      authToken={authToken}
      initialTab="sub"
      onOpenLive={onOpenLive}
      onOpenLogin={onOpenLogin}
      onOpenMentor={onOpenMentor}
      onOpenMy={onOpenMy}
    />
  );
}

export default LiveSubPage;
