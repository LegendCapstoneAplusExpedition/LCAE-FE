import React from 'react';

import { BoardCommentsScreen } from '../../../screens/mentor/BoardCommentsScreen';

type Props = {
  onBack?: () => void;
};

const noop = () => undefined;

export function LiveMentorBoardDetailPage({
  onBack = noop,
}: Props): React.JSX.Element {
  return <BoardCommentsScreen onBack={onBack} />;
}

export default LiveMentorBoardDetailPage;
