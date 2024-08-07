import React, {useCallback, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
const Ionicons = React.lazy(() => import('react-native-vector-icons/Ionicons'));
const Icon = React.lazy(() =>
  import('react-native-vector-icons/MaterialCommunityIcons'),
);
import colors from 'tailwindcss/colors';
import DynamicIcon from '../../components/DynamicIcon';
import InventoryItems from '../../components/inventory/InventoryItems';
import {useNavigation} from '@react-navigation/native';
import InventoryService from '../../services/InventoryService';
import {useDispatch, useSelector} from 'react-redux';
import {fetchInventoryData} from '../../store/inventory';
import {removeOrderItem, setPosId} from '../../store/orders';
import OrderItems from '../../components/inventory/OrderItems';

const {width, height} = Dimensions.get('screen');

const MD = 412;
//const smallScreen = width < MD;
//const shortScreen = height < 700;
const smallScreen = true;
const shortScreen = true;

const Dashboard = props => {
  const [active, setActive] = useState(0);
  const [showDrawer, setShowDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [importing, setImporting] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const [lookups, setLookups] = useState({});
  const [isFocused, setIsFocused] = useState(false);

  const {userData} = useSelector(store => store.auth);
  const {importCategories, importItems, loading} = useSelector(
    store => store.inventory,
  );

  const {orderItems, total} = useSelector(store => store.orders);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleFocus = () => {
    //setIsFocused(true);
    // Any additional logic you want to execute when the TextInput is focused
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Any additional logic you want to execute when the TextInput loses focus
  };

  const loadRemoteInventoryData = useCallback(async () => {
    const count = await InventoryService.count('category');
    if (count === 0) {
      await reSyncInventory();
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
    let items = importItems.slice(0, 5).map(item => {
      const cat = categories.find(
        category => parseInt(category.id) === parseInt(item.categoryId),
      );
      return {
        ...item,
        category: cat,
      };
    });
    setItems(items);
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

  const reSyncInventory = async () => {
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
  };
  const gotoCheckOut = () => {
    dispatch(
      fetchInventoryData({
        type: 'inventory_items',
        importType: 'internal',
        tableName: 'inventory_item',
      }),
    );
    navigation.navigate('CheckOutScreen');
  };
  return (
    <>
      <View className="flex p-2 mt-2 flex-row mb-5 justify-between">
        <View className="flex flex-row justify-center items-center space-x-2">
          {/*<TouchableOpacity>
            <Ionicons name="menu-outline" color={colors.black} size={30} />
          </TouchableOpacity>*/}
          <Text className="text-black  font-bold text-sm lg:text-lg">
            {userData.user.fullName}
          </Text>
          <View className="flex items-center bg-church-200 text-purple-400 p-0.5 rounded-lg">
            <Text className="text-xs mx-2 text-church-800">Attendant</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ReportScreen')}
          className="w-12 h-12 rounded-full bg-white flex justify-center items-center">
          <Icon name="microsoft-excel" color={colors.green['600']} size={30} />
        </TouchableOpacity>
      </View>
      <View
        className={`flex flex-row ${
          smallScreen ? 'mt-0 h-16' : 'mt-5'
        } p-2 justify-between`}>
        <View
          className={`flex flex-row justify-center mb-2 items-center p-1 rounded-2xl
                            border border-gray-300 bg-white w-10/12 h-14`}>
          <Ionicons name="search-outline" size={28} />
          <TextInput
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search Items"
            onChangeText={setSearchTerm}
            placeholderTextColor={colors.gray['400']}
            className={`h-auto ${smallScreen ? 'w-72' : 'w-80'}`}
          />
        </View>
        <TouchableOpacity
          onPress={() => reSyncInventory()}
          className="bg-white p-1 items-center h-14 justify-center rounded-2xl border border-gray-300 w-14">
          <Ionicons
            name="sync-circle-outline"
            size={30}
            color={colors.purple['600']}
          />
        </TouchableOpacity>
      </View>
      <View className="flex h-fit align-middle content-center  w-full">
        <OrderItems items={orderItems} handleRemove={removeOrderItem} />
      </View>
      <View
        className={`flex ${
          smallScreen ? 'mt-1 p-1' : 'mt-5 p-2'
        } bg-white w-auto mx h-full`}>
        {!isFocused && (
          <View className={`${shortScreen ? 'h-24 mt-1' : 'h-32 mt-2'} w-full`}>
            {loading && importing === 'categories' ? (
              <ActivityIndicator size="small" color={colors.purple['600']} />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className={`${shortScreen ? 'h-20' : 'h-32'} space-x-1`}>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      handleCategorySearch(index, category);
                    }}
                    className={`relative border ${
                      smallScreen ? 'w-20 h-20 nx-1' : 'w-28 h-28 mx-2'
                    } items-center justify-center rounded-3xl ${
                      index === active
                        ? 'bg-church-150 border-church-450'
                        : 'border-church-200'
                    }`}>
                    <View
                      className={`flex items-center ${
                        smallScreen ? 'mt-0' : 'mt-2'
                      }`}>
                      <View
                        className={`flex items-center justify-center rounded-full bg-church-155 ${
                          smallScreen ? 'h-7 w-7' : 'h-10 w-10'
                        }`}>
                        <DynamicIcon
                          name={category.icon}
                          color={
                            index === active
                              ? colors.purple['500']
                              : colors.purple['600']
                          }
                          provider={category.provider}
                          size={smallScreen ? 15 : 20}
                        />
                      </View>
                      <Text
                        style={{fontSize: smallScreen ? 10 : 14}}
                        className={`font-bold text-church-700 ${
                          smallScreen ? 'mt-0' : 'mt-2'
                        }`}>
                        {category.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
        <View className={`${smallScreen ? 'mt-0' : 'mt-5'}`}>
          {loading && importing === 'items' && (
            <View className="justify-center mb-2 items-center">
              <ActivityIndicator size="small" color={colors.purple['600']} />
            </View>
          )}
          <InventoryItems items={items} />
        </View>
      </View>
      {!isFocused && (
        <View className="absolute bottom-0 left-0 w-full p-2">
          <TouchableOpacity
            disabled={orderItems.length === 0}
            onPress={() => gotoCheckOut()}
            className={`flex flex-row justify-between items-center bg-purple-500  rounded-full ${
              smallScreen ? 'py-1 h-12' : 'py-3 h-16'
            } px-6 mb-4`}>
            <Text className="text-white font-light">Proceed New Order</Text>
            <View className="flex flex-row space-x-2">
              <Text className="text-white  font-normal">
                {orderItems.length} items
              </Text>
              <Text className="text-white  font-bold">
                {total.toLocaleString()}
              </Text>
              <DynamicIcon
                name="arrow-right-alt"
                size={22}
                provider="MaterialIcons"
                color={colors.white}
              />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default Dashboard;
