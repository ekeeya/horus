import { View, Text } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';

export default function WalletScreen() {

  const route = useRoute();
  
  return (
    <View>
      <Text>
        {JSON.stringify(route.params)}
      </Text>
    </View>
  )
}