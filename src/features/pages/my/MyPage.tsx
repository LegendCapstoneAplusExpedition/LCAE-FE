import React from 'react';

import { MyPageScreen } from '../../screens/common/MyPageScreen';

type AuthUser = { id: string; username: string };

type Props = {
  authUser?: AuthUser | null;
  onOpenLive?: () => void;
  onOpenLogin?: () => void;
  onOpenMentorConsole?: () => void;
  onOpenMyLive?: () => void;
};

const noop = () => undefined;

export function MyPage({
  authUser,
  onOpenLive = noop,
  onOpenLogin = noop,
  onOpenMentorConsole = noop,
  onOpenMyLive = noop,
}: Props): React.JSX.Element {
  return (
    <MyPageScreen
      authUser={authUser}
      onOpenLive={onOpenLive}
      onOpenLogin={onOpenLogin}
      onOpenMentorConsole={onOpenMentorConsole}
      onOpenMyLive={onOpenMyLive}
    />
  );
}

export default MyPage;
