import React from 'react';

import { PostComposeScreen } from '../../../screens/mentor/PostComposeScreen';

type Props = {
  onBack?: () => void;
  onSubmit?: () => void;
};

const noop = () => undefined;

export function MentorBoardCreatePage({
  onBack = noop,
  onSubmit = noop,
}: Props): React.JSX.Element {
  return <PostComposeScreen onBack={onBack} onSubmit={onSubmit} />;
}

export default MentorBoardCreatePage;
