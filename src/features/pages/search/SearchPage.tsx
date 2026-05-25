import React from 'react';

import { SearchScreen } from '../../screens/viewer/SearchScreen';

type Props = {
  onBack?: () => void;
  onOpenLive?: () => void;
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
