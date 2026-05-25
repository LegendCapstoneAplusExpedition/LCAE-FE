import React from 'react';

import { MyPageScreen } from '../../screens/common/MyPageScreen';

type Props = {
  onOpenLive?: () => void;
  onOpenMentorConsole?: () => void;
  onOpenMyLive?: () => void;
};

const noop = () => undefined;

export function MyPage({
  onOpenLive = noop,
  onOpenMentorConsole = noop,
  onOpenMyLive = noop,
}: Props): React.JSX.Element {
  return (
    <MyPageScreen
      onOpenLive={onOpenLive}
      onOpenMentorConsole={onOpenMentorConsole}
      onOpenMyLive={onOpenMyLive}
    />
  );
}

export default MyPage;
