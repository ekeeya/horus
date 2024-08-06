import {Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import DynamicIcon from '../DynamicIcon';
import colors from 'tailwindcss/colors';
import React, {useEffect, useMemo, useState} from 'react';
import {removeOrderItem, setOrderItems} from '../../store/orders';
import {useDispatch, useSelector} from 'react-redux';
import {DOMAIN} from '../../axios';
import InventoryService from '../../services/InventoryService';

const {width, height} = Dimensions.get('screen');

const MD = 412;
//const smallScreen = width < MD;
const smallScreen = true;

const InventoryItem = ({item}) => {
  const {name, price} = item;
  const [quantity, setQuantity] = useState(0);
  const [itemCategory, setItemCategory] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cat = await InventoryService.getById('category', item.categoryId);
        setItemCategory(cat);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if (!item.category) {
      fetchData();
    } else {
      setItemCategory(item.category);
    }
  }, [itemCategory]);
  useEffect(() => {
    if (quantity < 0) {
      setQuantity(0);
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

  return (
    <View
      className={`flex flex-row ${
        smallScreen ? 'h-20 mx-1 mb-1' : 'h-24 mx-2 mb-4'
      } justify-between border border-church-450 rounded-2xl`}>
      <View className="flex flex-row justify-end items-center">
        <View
          className={`flex ${
            smallScreen ? 'mx-1 my-1 w-16' : 'mx-2 my-2 w-20'
          } bg-gray-100  rounded-2xl  justify-center items-center`}>
          {itemCategory && (
            <Image
              resizeMode="center"
              source={{
                uri: `${DOMAIN}/statics/${
                  item.category ? item.category.image : itemCategory.image
                }`,
              }}
              className={`h-full ${smallScreen ? 'w-12' : 'w-16'}`}
            />
          )}
        </View>
        <View>
          <Text className={`font-semibold ${smallScreen && 'text-xs'}`}>
            {name}
          </Text>
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
          } rounded-full ${
            smallScreen ? 'h-11 w-11' : 'h-16 w-16'
          } justify-center items-center`}>
          <DynamicIcon
            color={quantity <= 1 ? colors.gray['400'] : colors.purple['600']}
            name="minus-a"
            size={smallScreen ? 12 : 15}
            provider="Fontisto"
          />
        </TouchableOpacity>
        <Text
          className={`font-bold text-black ${
            smallScreen ? 'text-sm mx-1' : 'text-2xl mx-3'
          }`}>
          {quantity}
        </Text>
        <TouchableOpacity
          onPress={() => addOrderItem(quantity + 1)}
          className={`border border-purple-300 rounded-full ${
            smallScreen ? 'h-11 w-11' : 'h-16 w-16'
          } justify-center items-center`}>
          <DynamicIcon
            name="plus-a"
            color={colors.purple['600']}
            size={smallScreen ? 12 : 15}
            provider="Fontisto"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InventoryItem;
