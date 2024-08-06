import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import DynamicIcon from '../DynamicIcon';
import colors from 'tailwindcss/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {removeOrderItem, setOrderItems} from '../../store/orders';
import {useDispatch} from 'react-redux';
import {DOMAIN} from '../../axios';
const {width, height} = Dimensions.get('screen');

// const smallScreen = width < 365;
const smallScreen = true;

const InventoryItem = ({item}) => {
  const {name, price} = item;
  const [quantity, setQuantity] = useState(item.quantity);

  const dispatch = useDispatch();
  useEffect(() => {
    if (quantity < 1) {
      setQuantity(0);
      // if quantity is less than 1 remove it from list
      dispatch(removeOrderItem(item));
    }
  }, [quantity]);


  const addOrderItem = quantity => {
    setQuantity(quantity);
    if (quantity > 0) {
      const orderItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        quantity: quantity,
      };
      dispatch(setOrderItems(orderItem));
    } else {
      dispatch(removeOrderItem(item));
    }
  };
  const removeItem = () => {
    dispatch(removeOrderItem(item));
  };

  return (
    <View
      className={`flex flex-row justify-between border border-church-450 rounded-2xl ${
        smallScreen ? 'mb-2 mt-0 h-16 mx-1' : 'mb-3 mt-2 h-24 mx-2'
      }`}>
      <View className="flex flex-row justify-end items-center">
        <View className="mx-2">
          <Image
            resizeMode="center"
            source={{
              uri: `${DOMAIN}/statics/${
                item.category ? item.category.image : item.category.image
              }`,
            }}
            className="h-full w-10"
          />
        </View>
        <View className={`${smallScreen && 'mt-2 mb-1'}`}>
          <Text className={`font-semibold ${smallScreen ? 'text-xs' : ''}`}>
            {name}
          </Text>
          <Text
            className={`font-bold text-black ${smallScreen ? 'text-xs' : ''}`}>
            {parseFloat(price).toLocaleString()} /=
          </Text>
          <TouchableOpacity
            onPress={() => removeItem()}
            className="w-14 justify-start border-b-2 mb-1 border-b-red-600 mt-0 h-6">
            <Text
              className={`text-red-600 font-bold ${
                smallScreen ? 'text-xs' : 'text-sm'
              }`}>
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex mx-3 flex-row justify-evenly items-center">
        <TouchableOpacity
          disabled={quantity <= 1}
          onPress={() => addOrderItem(quantity - 1)}
          className={`border ${
            quantity <= 1 ? 'border-gray-300' : 'border-purple-300'
          } rounded-full ${
            smallScreen ? 'h-10 w-10' : 'h-12 w-12'
          } justify-center items-center`}>
          <DynamicIcon
            color={quantity <= 1 ? colors.gray['400'] : colors.purple['600']}
            name="minus-a"
            size={15}
            provider="Fontisto"
          />
        </TouchableOpacity>
        <Text
          className={`font-bold text-black mx-3 ${
            smallScreen ? 'text-xl' : 'text-2xl'
          }`}>
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => addOrderItem(quantity + 1)}
          className={`border border-purple-300 rounded-full ${
            smallScreen ? 'h-10 w-10' : 'h-12 w-12'
          } justify-center items-center`}>
          <DynamicIcon
            name="plus-a"
            color={colors.purple['600']}
            size={15}
            provider="Fontisto"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InventoryItem;
