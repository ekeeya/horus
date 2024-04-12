import {StatusBar} from 'react-native';
import React from 'react';
import AppNavigation from './navigation/AppNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';


export default function App() {
  return (
    <SafeAreaProvider>
    <StatusBar
          animated={true}
          backgroundColor="#ffff"
          barStyle="dark-content"
        />
    <AppNavigation />
    </SafeAreaProvider>
  );
}
