import {View, Text, Alert, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  ArrowLeft,
  ArrowPathRoundedSquare,
  BellAlert,
} from '@nandorojo/heroicons/24/outline';
import AnimatedLoader from 'react-native-animated-loader';
import {storeColors} from '../theme';
import {formatCreditCardNumber} from '../utils';
import Transactions from '../components/Transactions';
import BottomTopUpSheet from '../components/BottomTopUpSheet';
import ActionsList from '../components/ActionsList';
import {useDispatch, useSelector} from 'react-redux';
import {linkToStudent} from '../store/students';
import {fetchTransactions} from '../store/transactions';
import DynamicIcon from '../components/DynamicIcon';
import colors from 'tailwindcss/colors';
import WalletCard from '../components/WalletCard';
import { setShowTopUp } from "../store/wallet";

export default function WalletScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {student} = route.params;
  const [action, setAction] = useState();

  const dispatch = useDispatch();

  const {fetching, transactions} = useSelector(store => store.transactions);

  const {loading} = useSelector(store => store.students);

  const handleSelected = value => {
    setAction(value);
  };

  const handleOnTopUpClose = () => {
    dispatch(fetchTransactions({student: student.id}));
  };

  useEffect(() => {
    dispatch(fetchTransactions({student: student.id}));
  }, [dispatch, student.id]);

  return (
    <View className="flex h-screen p-2 bg-white">
      <View className="flex flex-row mx-2 justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
          <ArrowLeft color="black" />
        </TouchableOpacity>
        <View className="flex flex-row">
          <TouchableOpacity className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
            <BellAlert color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-5">
        <View className="flex items-center">
          <Text className="font-bold">Balance</Text>
          <Text className="font-bold text-2xl text-blue-800">
            UGX {student.wallet.balance.toLocaleString()}
          </Text>
        </View>

        <View className="flex mx-5 flex-row mt-3 space-x-5 justify-center">
          <View
            style={{backgroundColor: '#ffcecd'}}
            className="flex space-x-2 items-center w-1/2 h-12 p-2 rounded-lg flex-row justify-center">
            <DynamicIcon
              name="upload"
              size={25}
              provider="Feather"
              color={colors.red['700']}
            />
            <Text className="font-bold text-lg text-red-700">
              UGX {student.wallet.totalOut.toLocaleString()}
            </Text>
          </View>
          <View
            style={{backgroundColor: '#dde1fa'}}
            className="flex space-x-2 items-center w-1/2 h-12 p-2 rounded-lg flex-row justify-center">
            <DynamicIcon
              name="download"
              size={25}
              provider="Feather"
              color={colors.blue['700']}
            />
            <Text className="font-bold text-lg text-blue-700">
              UGX {student.wallet.totalIn.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <WalletCard single count={1} idx={0} item={student} />
      </View>

      <View className="mt-3 mb-2">
        <ActionsList student={student} onPress={handleSelected} />
      </View>
      <View className="mx-5 mt-2 p-1">
        <Text className="font-bold text-blue-800 text-xl">
          Recent Transactions
        </Text>
        <Transactions transactions={transactions} />
      </View>

      <AnimatedLoader
        visible={loading}
        overlayColor="rgba(255,255,255,0.75)"
        animationStyle={{width: 100, height: 100}}
        animationType="slide"
        speed={1}>
        <Text className="font-extrabold text-white">Linking....</Text>
      </AnimatedLoader>
      <BottomTopUpSheet
        wallet={student.wallet}
        onClose={handleOnTopUpClose}
      />
    </View>
  );
}
