import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import React, {useEffect, useMemo, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft} from '@nandorojo/heroicons/24/outline';
import AnimatedLoader from 'react-native-animated-loader';
import Transactions from '../components/Transactions';
import BottomTopUpSheet from '../components/BottomTopUpSheet';
import ActionsList from '../components/ActionsList';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTransactions} from '../store/transactions';
import DynamicIcon from '../components/DynamicIcon';
import colors from 'tailwindcss/colors';
import WalletCard from '../components/WalletCard';

const {width, height} = Dimensions.get('window');
export default function WalletScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const {student} = route.params;

  const dispatch = useDispatch();

  const {fetching, transactions} = useSelector(store => store.transactions);

  const {loading} = useSelector(store => store.students);


  const handleOnTopUpClose = () => {
    dispatch(fetchTransactions());
  };

  useEffect(() => {
    dispatch(fetchTransactions({student: student.id}));
  }, [dispatch, student.id]);

  return (
    <View className="flex h-screen p-2 bg-white">
      <ScrollView>
        <View className="flex flex-row mx-2 justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
            <ArrowLeft color="black" />
          </TouchableOpacity>
          {/*<View className="flex flex-row">
          <TouchableOpacity className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
            <BellAlert color="black" />
          </TouchableOpacity>
        </View>*/}
        </View>
        <View className="mt-2">
          <View className="flex items-center">
            <Text className="font-bold">Balance</Text>
            <Text className="font-bold text-2xl text-blue-800">
              UGX {student.wallet.balance.toLocaleString()}
            </Text>
          </View>

          <View className="flex mx-5 flex-row mt-2 space-x-5 justify-center">
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  fetchTransactions({student: student.id, type: 'PAYMENT'}),
                );
              }}
              style={{backgroundColor: '#ffcecd'}}
              className="flex space-x-2 items-center w-1/2 h-12 p-2 rounded-lg flex-row justify-center">
              <DynamicIcon
                name="arrow-up-right"
                size={25}
                provider="Feather"
                color={colors.red['700']}
              />
              <Text
                style={width < 330 ? {fontSize: 12} : {}}
                className="font-bold text-lg text-red-700">
                UGX {student.wallet.totalOut.toLocaleString()}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(
                  fetchTransactions({student: student.id, type: 'COLLECTION'}),
                );
              }}
              style={{backgroundColor: '#dde1fa'}}
              className="flex space-x-2 items-center w-1/2 h-12 p-2 rounded-lg flex-row justify-center">
              <DynamicIcon
                name="arrow-down-right"
                size={25}
                provider="Feather"
                color={colors.blue['700']}
              />
              <Text
                style={width < 330 ? {fontSize: 12} : {}}
                className="font-bold text-lg text-blue-700">
                UGX {student.wallet.totalIn.toLocaleString()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-5">
          <WalletCard single count={1} idx={0} item={student} />
        </View>

        <View className="mt-2 mb-2">
          <ActionsList student={student} />
        </View>
        <View className={`${width < 370 ? 'mx-1' : 'mx-5'} mt-2 p-1`}>
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
          wallet={student.wallet} onClose={handleOnTopUpClose} />
      </ScrollView>
    </View>
  );
}
