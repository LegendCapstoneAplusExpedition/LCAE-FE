import React from 'react';

import { SearchScreen } from '../../screens/viewer/SearchScreen';
import type { LiveSession } from '../../mocks';

type Props = {
  onBack?: () => void;
  onOpenLive?: (session?: LiveSession) => void;
  onOpenMentor?: () => void;
};

const noop = () => undefined;

export function SearchPage({
  onBack = noop,
  onOpenLive = noop,
  onOpenMentor = noop,
}: Props): React.JSX.Element {
  return (
    <SearchScreen
      onBack={onBack}
      onOpenLive={onOpenLive}
      onOpenMentor={onOpenMentor}
    />
  );
}

export default SearchPage;
