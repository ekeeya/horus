import {Image, Text, TouchableOpacity, ScrollView, View} from 'react-native';
import React, {useMemo} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from 'tailwindcss/colors';
import { removeOrderItem } from "../../store/orders";
import { useDispatch } from "react-redux";

const OrderItem = ({item, onClicked}) => {
  const {category, name, price, quantity} = item;

  const dispatch = useDispatch();
  const imageUri = useMemo(
    () => `data:image/png;base64,${category.image}`,
    [category],
  );

  const removeItem = () => {
    dispatch(removeOrderItem(item));
  };

  return (
    <View className="flex mt-5 mx-3 w-48 p-1 h-28 justify-center bg-white border-2 border-gray-300 rounded-xl">
      <Image
        resizeMode="cover"
        source={{uri: imageUri}}
        className="w-full h-full rounded-lg"
      />
      <TouchableOpacity
        onPress={() => removeItem()}
        className="absolute -right-2 -top-2 rounded-full bg-red-100 h-8 w-8 items-center justify-center">
        <Ionicons name="close" color={colors.red['600']} size={20} />
      </TouchableOpacity>
      <View className="absolute bottom-1 mx-1 bg-white h-50 w-full">
        <View showsVerticalScrollIndicator={false} className="w-auto">
          <View className="mx-3 mb-2">
            <Text className="font-bold text-normal text-center">
              {name} x{quantity}
            </Text>
            <Text className="font-bold  text-center">
              {(quantity * price).toLocaleString()}/=
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;
