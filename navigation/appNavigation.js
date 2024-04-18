import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WalletScreen from '../screens/WalletScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();


export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
        <Stack.Screen name="Wallet" options={{headerShown: false}} component={WalletScreen} />
        <Stack.Screen name="Dashboad" options={{headerShown: false}} component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}