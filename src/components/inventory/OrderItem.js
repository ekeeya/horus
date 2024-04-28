import {Image, Text, TouchableOpacity, ScrollView, View} from 'react-native';
import React, { useMemo} from 'react';

const OrderItem = ({item, onClicked}) => {
  const {category, name, price, quantity} = item;

  const imageUri = useMemo(
    () => `data:image/png;base64,${category.image}`,
    [category],
  );

  return (
    <View className="flex mx-1 w-40 p-1 h-28 border border-gray-500 rounded-xl">
      <Image
        resizeMode="cover"
        source={{uri: imageUri}}
        className="w-full h-full"
      />
      <View className="absolute bottom-1 mx-1 bg-white-200 h-50 w-full">
        <ScrollView showsVerticalScrollIndicator={false} className="w-auto">
          <View className="mx-3 mb-2">
            <Text className="font-bold text-normal text-center">{name}</Text>
            <Text className="font-bold text-lg text-center">x{quantity}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default OrderItem;
