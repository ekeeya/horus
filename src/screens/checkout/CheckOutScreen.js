import React, {useState} from 'react';
import {View, StatusBar, TouchableOpacity, Text, Image} from 'react-native';
import DynamicIcon from '../../components/DynamicIcon';
import colors from 'tailwindcss/colors';
import {useNavigation} from '@react-navigation/native';
import InventoryItems from '../../components/inventory/InventoryItems';

export const CheckOutScreen = () => {
  const navigation = useNavigation();

  const [items, setItems] = useState([
    {
      id: 2,
      name: 'Coca Cola',
      category: 'drinks',
      price: 1500.0,
    },
    {
      id: 3,
      name: 'Samosas',
      category: 'foods',
      price: 500.0,
    },
    {
      id: 3,
      name: 'Samosas',
      category: 'foods',
      price: 500.0,
    },
    {
      id: 3,
      name: 'Samosas',
      category: 'foods',
      price: 500.0,
    },
    {
      id: 3,
      name: 'Samosas',
      category: 'foods',
      price: 500.0,
    },
    {
      id: 3,
      name: 'Samosas',
      category: 'foods',
      price: 500.0,
    },
  ]);
  return (
    <View className="flex flex-1" style={{backgroundColor: '#e9e9eb'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View className="bg-white p-2 h-20 flex flex-row justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 bg-gray-100 rounded-full">
          <DynamicIcon
            name="chevron-left"
            size={40}
            provider="MaterialIcons"
            color={colors.black}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Order #2145</Text>
        <TouchableOpacity className="h-10 w-10 bg-gray-100 rounded-full">
          <DynamicIcon
            name="information-outline"
            size={40}
            provider="Ionicons"
            color={colors.black}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{elevation: 2}}
        className="flex flex-row justify-between mt-5 items-center bg-white h-20 mx-4 rounded-xl">
        <View className="flex flex-row">
          <View className="p-2 mx-3 rounded-full items-center h-10 w-10 bg-church-150">
            <DynamicIcon
              name="flag"
              size={30}
              provider="Ionicons"
              color={colors.purple['500']}
            />
          </View>
          <View className="space-y-1">
            <Text className="font-semibold text-black">Trinity Secondary</Text>
            <Text className="text-gray-700 font-light">Eastern Wing</Text>
          </View>
        </View>
        <DynamicIcon
          name="chevron-right"
          size={30}
          provider="MaterialIcons"
          color={colors.black}
        />
      </TouchableOpacity>
      <View
        style={{elevation: 1}}
        className="flex flex-row justify-between mt-5 items-center bg-white h-28 mx-4 rounded-xl">
        <View className="flex flex-row">
          <View className="p-2 mx-3 rounded-full items-center h-20 w-20 bg-church-150">
            <Image
              source={require('../../assets/student.png')}
              className="h-14 w-14"
            />
          </View>
          <View className="space-y-1">
            <Text className="font-semibold text-black">
              Elvis Darlington Lubowa (S.5S)
            </Text>
            <Text className="text-gray-700 font-light">Trinity Secondary</Text>
            <Text className="font-semibold text-black text-xl">
              1,000,000/=
            </Text>
          </View>
        </View>
        <View className="p-3">
          <Text className="font-bold text-green-600">Active</Text>
        </View>
      </View>
      <View className="bg-white flex-1 mt-10">
        <Text className="text-black font-bold text-2xl mx-2 mt-2">Items</Text>
        <View className="mt-5 h-1/2 border-b-2 border-purple-600">
          <InventoryItems items={items} />
        </View>
        <View className="mt-5 border p-2 mx-2 rounded-xl border-gray-200 h-auto">
          <View className="border-b h-10 border-b-gray-200">
            <Text className="text-black font-bold text-2xl">Details</Text>
          </View>
          <View className="flex mt-2">
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-semibold">Total</Text>
              <Text className="text-2xl text-black font-semibold">
                1,000,000/=
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 left-0 w-full p-2">
        <TouchableOpacity
          onPress={() => navigation.navigate('CheckOutScreen')}
          className="flex justify-center items-center bg-purple-500 h-16 rounded-full py-3 px-6 mb-4">
          <View className="flex flex-row content-center space-x-2">
            <Text className="text-white text-3xl font-bold">Proceed</Text>
            <DynamicIcon
              className="mt-1"
              name="arrow-right-alt"
              size={30}
              provider="MaterialIcons"
              color={colors.white}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
