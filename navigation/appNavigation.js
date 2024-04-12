import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletScreen from '../screens/WalletScreen';
import DashboardScreen from '../screens/DashboardScreen';
const Stack = createNativeStackNavigator();


export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Dashboad'>
        <Stack.Screen name="Wallet" options={{headerShown: false}} component={WalletScreen} />
        <Stack.Screen name="Dashboad" options={{headerShown: false}} component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}