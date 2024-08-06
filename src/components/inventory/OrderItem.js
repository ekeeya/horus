import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from 'tailwindcss/colors';
import {removeOrderItem} from '../../store/orders';
import {useDispatch} from 'react-redux';
import {DOMAIN} from '../../axios';

const {width, height} = Dimensions.get('screen');

// const smallScreen = width < 412;
const smallScreen = true;
const OrderItem = ({item, onClicked}) => {
  const {name, price, quantity} = item;

  const dispatch = useDispatch();

  const removeItem = () => {
    dispatch(removeOrderItem(item));
  };

  return (
    <View
      className={`flex ${
        smallScreen ? 'mt-2 mx-2 w-32 p-0 h-20' : 'mt-5 mx-3 w-48 p-1 h-24'
      } justify-center bg-white border-2 border-gray-300 rounded-xl`}>
      <Image
        resizeMode="cover"
        source={{
          uri: `${DOMAIN}/statics/${item.category && item.category.image}`,
        }}
        className="w-full h-full rounded-lg"
      />
      <TouchableOpacity
        onPress={() => removeItem()}
        className="absolute -right-2 -top-2 rounded-full bg-red-100 h-8 w-8 items-center justify-center">
        <Ionicons name="close" color={colors.red['600']} size={20} />
      </TouchableOpacity>
      <View className="absolute bottom-1 mx-1 opacity-80 bg-white h-50 w-full">
        <View showsVerticalScrollIndicator={false} className="w-auto">
          <View className="mx-3 mb-2">
            <Text className="font-bold text-purple-950 text-normal text-center">
              {name} x{quantity}
            </Text>
            <Text className="font-bold text-purple-950 text-center">
              {(quantity * price).toLocaleString()}/=
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderItem;
