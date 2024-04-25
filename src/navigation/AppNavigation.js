import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Dashboard from '../screens/dashboard/Dashboard';
import {CheckOutScreen} from '../screens/checkout/CheckOutScreen';
import LoginScreen from '../screens/auth/LoginScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          options={{headerShown: false}}
          component={LoginScreen}
        />
        <Stack.Screen
          name="Dashboard"
          options={{headerShown: false}}
          component={Dashboard}
        />
        <Stack.Screen
          name="CheckOutScreen"
          options={{headerShown: false}}
          component={CheckOutScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
