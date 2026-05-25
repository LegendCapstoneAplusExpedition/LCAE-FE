import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import './global.css';
import {AppRoot} from './src/app/AppRoot';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <AppRoot />
    </SafeAreaProvider>
  );
}

export default App;
