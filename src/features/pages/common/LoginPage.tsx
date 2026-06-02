import React from 'react';

import { LoginScreen } from '../../screens/common/LoginScreen';

type AuthUser = { id: string; username: string };

type Props = {
  onBack?: () => void;
  onLogin: (token: string, user: AuthUser) => void;
};

const noop = () => undefined;

export function LoginPage({ onBack = noop, onLogin }: Props): React.JSX.Element {
  return <LoginScreen onBack={onBack} onLogin={onLogin} />;
}

export default LoginPage;
