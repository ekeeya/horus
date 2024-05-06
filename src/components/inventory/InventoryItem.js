import {Image, Text, TouchableOpacity, View} from 'react-native';
import DynamicIcon from '../DynamicIcon';
import colors from 'tailwindcss/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {removeOrderItem, setOrderItems} from '../../store/orders';
import {useDispatch} from 'react-redux';
import {DOMAIN} from '../../axios';

const InventoryItem = ({item}) => {
  const {category, name, price} = item;
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (quantity < 0) {
      setQuantity(0);
    }
  }, [quantity]);
  const imageUri = useMemo(() => {
    return `${DOMAIN}/assets/${category.image}`;
  }, [category]);

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

  return (
    <View className="flex flex-row  mb-3 justify-between border border-church-450 h-24 mx-2 rounded-2xl">
      <View className="flex flex-row justify-end items-center">
        <View className="flex mx-2 bg-gray-100 my-2 rounded-2xl w-20 justify-center items-center">
          <Image
            resizeMode="center"
            source={{uri: imageUri}}
            className="h-full w-16"
          />
        </View>
        <View>
          <Text className="font-semibold">{name}</Text>
          <Text className="font-bold text-black">
            {parseFloat(price).toLocaleString()} /=
          </Text>
        </View>
      </View>
      <View className="flex mx-3 flex-row justify-evenly items-center">
        <TouchableOpacity
          disabled={quantity <= 0}
          onPress={() => addOrderItem(quantity - 1)}
          className={`border ${
            quantity <= 1 ? 'border-gray-300' : 'border-purple-300'
          } rounded-full h-16 w-16 justify-center items-center`}>
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
          className="border border-purple-300 rounded-full h-16 w-16 justify-center items-center">
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
