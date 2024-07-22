import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import StoreProvider from './src/redux/store';
import { Provider as PaperProvider } from 'react-native-paper';
import theme from './src/utils/theme';

const App = () => {
  return (
    <StoreProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;
