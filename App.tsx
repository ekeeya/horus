import {StatusBar} from 'react-native';
import React from 'react';
import AppNavigation from './navigation/appNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './screens/HomeScreen';
// import GameStore from './screens/gameStore';

// const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <SafeAreaProvider>
    <StatusBar
          animated={true}
          backgroundColor="#008080"
          barStyle="light-content"
        />
    <AppNavigation />
    </SafeAreaProvider>
  );
}
