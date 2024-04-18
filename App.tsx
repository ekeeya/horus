import {StatusBar} from 'react-native';
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import {Provider} from 'react-redux';
import {AlertNotificationRoot} from 'react-native-alert-notification';
import {store} from "./store/store";

export default function App() {
  return (
    <SafeAreaProvider>
    <StatusBar
          animated={true}
          backgroundColor="#ffff"
          barStyle="dark-content"
        />
        <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
          <PaperProvider>
          <AlertNotificationRoot>
          <AppNavigation />
          </AlertNotificationRoot>
          </PaperProvider>
          </Provider>
        </GestureHandlerRootView>
   
    </SafeAreaProvider>
  );
}
