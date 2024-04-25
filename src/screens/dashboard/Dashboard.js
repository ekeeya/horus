import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {TypingAnimation} from 'react-native-typing-animation';
import colors from 'tailwindcss/colors';
import DynamicIcon from '../../components/DynamicIcon';
import InventoryItems from '../../components/inventory/InventoryItems';
import {useNavigation} from '@react-navigation/native';
import InventoryService from '../../services/InventoryService';

const items = [
  {
    id: 1,
    name: 'Bic Pens',
    categoryId: 4,
    price: 1000.0,
  },
  {
    id: 2,
    name: 'Coca Cola',
    categoryId: 2,
    price: 1500.0,
  },
  {
    id: 3,
    name: 'Samosas',
    categoryId: 3,
    price: 500.0,
  },
  {
    id: 4,
    name: 'Counter Books 96 Pages',
    categoryId: 4,
    price: 5000.0,
  },
];
const Dashboard = props => {
  const [active, setActive] = useState(0);

  useEffect(() => {}, []);

  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Favourite',
      icon: 'favorite',
      provider: 'Fontisto',
      image: 'favorite',
    },
    {
      id: 2,
      name: 'Drinks',
      icon: 'coffeescript',
      provider: 'Fontisto',
      image: 'drinks',
    },
    {
      id: 3,
      name: 'Food',
      icon: 'fast-food',
      provider: 'Ionicons',
      image: 'foods',
    },
    {
      id: 4,
      name: 'Learning',
      icon: 'graduation-cap',
      provider: 'Entypo',
      image: 'learning',
    },
  ]);
  const [inventoryData, setInventoryData] = useState([]);

  const loadDataCallback = useCallback(async () => {
    try {
      // await InventoryService.save('category', categories);
      const data = await InventoryService.fetch('inventory_item');
      if (data.length) {
        setInventoryData(data);
      } else {
        await InventoryService.save('inventory_item', items);
        setInventoryData(items);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const navigation = useNavigation();
  return (
    <>
      <View className="flex p-2 mt-2 flex-row justify-between">
        <View className="flex flex-row justify-center items-center space-x-2">
          <TouchableOpacity>
            <Ionicons name="menu-outline" color={colors.black} size={30} />
          </TouchableOpacity>
          <Text className="text-black font-bold text-lg">Namatovu Parvin</Text>
          <View className="flex items-center bg-church-200 text-purple-400 p-0.5 rounded-lg">
            <Text className="text-xs mx-2 text-church-800">Attendant</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" color={colors.black} size={30} />
        </TouchableOpacity>
      </View>
      <View className="flex flex-row mt-5 p-2 justify-between">
        <View className="flex flex-row items-center p-1 rounded-2xl border border-gray-300 w-96 bg-white">
          <Ionicons name="search-outline" size={28} />
          <TextInput
            placeholder="Search Products"
            placeholderTextColor={colors.gray['400']}
            className="h-auto w-80"
          />
        </View>
        <TouchableOpacity className="bg-white p-1 items-center justify-center rounded-2xl border border-gray-300 w-12">
          <Octicons name="sort-asc" size={25} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 mt-10 bg-white w-auto p-2 mx h-full">
        <View className="h-32 mt-2 w-full">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="h-32 space-x-1">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setActive(index);
                }}
                className={`relative border w-28 items-center justify-center h-28 rounded-3xl mx-2 ${
                  index === active
                    ? 'bg-church-150 border-church-450'
                    : 'border-church-200'
                }`}>
                <View className="flex items-center mt-5">
                  <View className="flex items-center justify-center rounded-full h-10 w-10 bg-church-155">
                    <DynamicIcon
                      name={category.icon}
                      color={
                        index === active
                          ? colors.purple['500']
                          : colors.purple['600']
                      }
                      provider={category.provider}
                      size={20}
                    />
                  </View>
                  <Text className="font-bold text-church-700 mt-0">
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View className="mt-5">
          <View className="justify-center items-center">
            <TypingAnimation
              dotColor={colors.purple['600']}
              dotMargin={10}
              dotAmplitude={3}
              dotSpeed={0.14}
              dotRadius={3.5}
              dotX={12}
              dotY={6}
            />
          </View>
          <InventoryItems items={inventoryData} />
        </View>
      </View>
      <View className="absolute bottom-0 left-0 w-full p-2">
        <TouchableOpacity
          onPress={() => navigation.navigate('CheckOutScreen')}
          className="flex flex-row justify-between items-center bg-purple-500 h-16 rounded-full py-3 px-6 mb-4">
          <Text className="text-white font-light">Proceed New Order</Text>
          <View className="flex flex-row space-x-2">
            <Text className="text-white  font-normal">3 items</Text>
            <Text className="text-white  font-bold">1,000,000</Text>
            <DynamicIcon
              name="arrow-right-alt"
              size={22}
              provider="MaterialIcons"
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Dashboard;
