import {StatusBar} from 'react-native';
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <SafeAreaProvider>
    <StatusBar
          animated={true}
          backgroundColor="#ffff"
          barStyle="dark-content"
        />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperProvider>
          <AppNavigation />
          </PaperProvider>
        </GestureHandlerRootView>
   
    </SafeAreaProvider>
  );
}
