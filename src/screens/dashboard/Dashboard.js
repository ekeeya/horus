import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import colors from 'tailwindcss/colors';
import DynamicIcon from '../../components/DynamicIcon';
import InventoryItems from '../../components/inventory/InventoryItems';
import {useNavigation} from '@react-navigation/native';
import InventoryService from '../../services/InventoryService';
import {useDispatch, useSelector} from 'react-redux';
import {fetchInventoryData} from '../../store/inventory';
import {TypingAnimation} from 'react-native-typing-animation';
import {setOrderItems, setPosId} from '../../store/orders';
import {OrderItem} from '../../models/inventory.tsx';
import OrderItems from "../../components/inventory/OrderItems";

const Dashboard = props => {
  const [active, setActive] = useState(0);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [importing, setImporting] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [lookups, setLookups] = useState({});

  useEffect(() => {}, []);
  const {userData} = useSelector(store => store.auth);
  const {importCategories, importItems, loading} = useSelector(
    store => store.inventory,
  );

  const {orderItems, total} = useSelector(store => store.orders);
  const dispatch = useDispatch();

  const loadRemoteInventoryData = useCallback(async () => {
    const count = await InventoryService.count('category');
    if (count === 0) {
      setImporting('categories');
      await dispatch(
        fetchInventoryData({
          type: 'categories',
          importType: 'external',
        }),
      );
      setImporting('items');
      // now fetch items
      await dispatch(
        fetchInventoryData({
          type: 'inventory_items',
          importType: 'external',
          posId: userData.user.posCenter.id,
        }),
      );
      setImporting(null);
    } else {
      setImporting('categories');
      await dispatch(
        fetchInventoryData({
          type: 'categories',
          importType: 'internal',
          tableName: 'category',
          limit: 100,
        }),
      );
      setImporting('items');
      await dispatch(
        fetchInventoryData({
          type: 'inventory_items',
          importType: 'internal',
          tableName: 'inventory_item',
        }),
      );
      setImporting(null);
    }
  }, []);

  const handleCategorySearch = async (index, item) => {
    setActive(index);
    setImporting('items');
    await dispatch(
      fetchInventoryData({
        type: 'inventory_items',
        importType: 'internal',
        tableName: 'inventory_item',
        lookups: item.id > 0 ? {categoryId: item.id} : null,
      }),
    );
    setLookups({categoryId: item.id});
    setImporting(null);
  };
  useEffect(() => {
    loadRemoteInventoryData();
    dispatch(setPosId(userData.user.posCenter.id));
  }, [dispatch, loadRemoteInventoryData, userData.user.posCenter.id]);

  useEffect(() => {
    setItems(importItems.slice(0, 5));
  }, [importItems]);

  useEffect(() => {
    setCategories(importCategories);
  }, [importCategories]);

  useEffect(() => {
    if (searchTerm) {
      dispatch(
        fetchInventoryData({
          type: 'inventory_items',
          importType: 'internal',
          tableName: 'inventory_item',
          lookups: Object.keys(lookups).length > 0 ? lookups : null,
          searchTerm,
        }),
      );
    }
  }, [dispatch, lookups, searchTerm]);

  const addOrderItem = (item, quantity) => {
    const orderItem = {
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      quantity: quantity,
    };
    dispatch(setOrderItems(orderItem));
  };
  const removeOrderItem = (item)=>{
    console.log(item)
  }
  const navigation = useNavigation();
  return (
    <>
      <View className="flex p-2 mt-2 flex-row justify-between">
        <View className="flex flex-row justify-center items-center space-x-2">
          <TouchableOpacity>
            <Ionicons name="menu-outline" color={colors.black} size={30} />
          </TouchableOpacity>
          <Text className="text-black font-bold text-lg">
            {userData.user.fullName}
          </Text>
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
            onChangeText={setSearchTerm}
            placeholderTextColor={colors.gray['400']}
            className="h-auto w-80"
          />
        </View>
        <TouchableOpacity className="bg-white p-1 items-center justify-center rounded-2xl border border-gray-300 w-12">
          <Octicons name="sort-asc" size={25} />
        </TouchableOpacity>
      </View>
      <View className="mt-5 w-full">
        <OrderItems items={orderItems} handleRemove={removeOrderItem} />
      </View>
      <View className="flex-1 mt-10 bg-white w-auto p-2 mx h-full">
        <View className="h-32 mt-2 w-full">
          {loading && importing === 'categories' ? (
            <ActivityIndicator size="small" color={colors.purple['600']} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="h-32 space-x-1">
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    handleCategorySearch(index, category);
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
          )}
        </View>
        <View className="mt-5">
          {loading && importing === 'items' && (
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
          )}
          <InventoryItems handleOnClick={addOrderItem} items={items} />
        </View>
      </View>
      <View className="absolute bottom-0 left-0 w-full p-2">
        <TouchableOpacity
          onPress={() => navigation.navigate('CheckOutScreen')}
          className="flex flex-row justify-between items-center bg-purple-500 h-16 rounded-full py-3 px-6 mb-4">
          <Text className="text-white font-light">Proceed New Order</Text>
          <View className="flex flex-row space-x-2">
            <Text className="text-white  font-normal">
              {orderItems.length} items
            </Text>
            <Text className="text-white  font-bold">{total.toLocaleString()}</Text>
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
