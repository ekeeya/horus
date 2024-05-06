import {Image, Text, TouchableOpacity, View} from 'react-native';
import DynamicIcon from '../DynamicIcon';
import colors from 'tailwindcss/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {removeOrderItem, setOrderItems} from '../../store/orders';
import {useDispatch} from 'react-redux';
import { DOMAIN } from "../../axios";

const InventoryItem = ({item}) => {
  const {category, name, price} = item;
  const [quantity, setQuantity] = useState(item.quantity);

  const dispatch = useDispatch();
  useEffect(() => {
    if (quantity < 1) {
      setQuantity(0);
      // if quantity is less than 1 remove it from list
      dispatch(removeOrderItem(item));
    }
  }, [quantity]);

  const imageUri = useMemo(
    () => `${DOMAIN}/assets/${category.image}`,
    [category],
  );

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
    <View className="flex flex-row mb-3 mt-2 justify-between border border-church-450 h-24 mx-2 rounded-2xl">
      <View className="flex flex-row justify-end items-center">
        <View className="mx-2">
          <Image
            resizeMode="center"
            source={{uri: imageUri}}
            className="h-full w-10"
          />
        </View>
        <View>
          <Text className="font-semibold">{name}</Text>
          <Text className="font-bold text-black">
            {parseFloat(price).toLocaleString()} /=
          </Text>
          <TouchableOpacity
            onPress={() => removeItem()}
            className="w-20 justify-center items-center border-b-2 mb-1 border-b-red-600  mt-2  h-6">
            <Text className="text-red-600 font-bold text-sm">Remove</Text>
          </TouchableOpacity>
        </View>

      </View>
      <View className="flex mx-3 flex-row justify-evenly items-center">
        <TouchableOpacity
          disabled={quantity <= 1}
          onPress={() => addOrderItem(quantity - 1)}
          className={`border ${
            quantity <= 1 ? 'border-gray-300' : 'border-purple-300'
          } rounded-full h-12 w-12 justify-center items-center`}>
          <DynamicIcon
            color={quantity <= 1 ? colors.gray['400'] : colors.purple['600']}
            name="minus-a"
            size={15}
            provider="Fontisto"
          />
        </TouchableOpacity>
        <Text className="font-bold text-black text-2xl mx-3">{quantity}</Text>
        <TouchableOpacity
          onPress={() => addOrderItem(quantity + 1)}
          className="border border-purple-300 rounded-full h-12 w-12 justify-center items-center">
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
