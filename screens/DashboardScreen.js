import {View, Text, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {storeColors} from '../theme';
import Beneficiaries from '../components/Beneficiaries';
import Transactions from '../components/Transactions';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStudents, fetchSchools} from '../store/students';
import {fetchTransactions} from '../store/transactions';
import StudentSearchActionSheet from '../components/StudentSearchActionSheet';
import colors from 'tailwindcss/colors';
import DynamicIcon from '../components/DynamicIcon';
import ActionsList from '../components/ActionsList';

export default function DashboardScreen() {
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();

  const {students, schools} = useSelector(store => store.students);

  const {userData} = useSelector(store => store.auth);
  const {transactions} = useSelector(store => store.transactions);

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchStudents());
    dispatch(fetchTransactions({}));
  }, []);

  const handleCreateClicked = () => {
    setShowSearch(true);
  };
  const handleOnclose = () => {
    setShowSearch(false);
  };

  const handleSelected = value => {
    console.log(value);
  };

  return (
    <ScrollView className="w-full bg-custom-lightblue flex-1">
      <SafeAreaView>
        <View className="container">
          <View className="flex flex-row justify-between mt-8">
            <View className="p-1 mx-3">
              <Text
                style={{color: storeColors.blue}}
                className="font-bold text-lg">
                Hi, {userData.user.firstName}
              </Text>
              <Text className="font-bold">Welcome back</Text>
            </View>
            <View className="rounded-full">
              <Image
                source={require('../assets/images/student.png')}
                className="w-12 h-12 mx-4"
              />
            </View>
          </View>

          <View
            className={`flex flex-row justify-between p-1 mx-3 mt-${'8'} mb-2`}>
            <View className={'space-y-1'}>
              <Text className="font-bold">Cash Contributions</Text>
              <View className="flex flex-row space-x-2 items-center">
                <Text className="font-bold text-blue-800 text-xs mt-1">
                  UGX
                </Text>
                <Text className="font-bold text-blue-800 text-lg">
                  2,000,000
                </Text>
              </View>
            </View>
          </View>
          <Beneficiaries
            onCreateClicked={handleCreateClicked}
            beneficiaries={students}
          />

          <View
            className={
              'flex flex-row bg-blue-800 mx-5 h-16 mt-3 rounded-xl items-center justify-between p-2'
            }>
            <View className="flex flex-row space-x-2 justify-start items-center">
              <View className="flex justify-center h-10 w-10 rounded-full items-center bg-white">
                <DynamicIcon
                  name="pie-chart"
                  size={22}
                  provider="FontAwesome"
                  color={colors.blue['900']}
                />
              </View>
              <View className="space-y-0">
                <Text className="font-bold text-white">Balance</Text>
                <Text className="font-bold text-gray-400">500/=</Text>
              </View>
            </View>
            <View className="border border-gray-500 bg-gray-500 h-10" />
            <View className="mx-3">
              <View className="flex flex-row items-center space-x-2 justify-start">
                <DynamicIcon
                  name="arrow-forward-outline"
                  size={20}
                  provider="Ionicons"
                  color={colors.white}
                />
                <Text className="text-xs text-white font-bold">UGX</Text>
                <Text className="text-gray-200 font-bold">2,000,000</Text>
              </View>
              <View className="flex flex-row items-center space-x-2 justify-start">
                <DynamicIcon
                  name="arrow-back-outline"
                  size={20}
                  provider="Ionicons"
                  color={colors.white}
                />
                <Text className="text-xs text-white font-bold">UGX</Text>
                <Text className="text-gray-200 font-bold">1,500,000</Text>
              </View>
            </View>
          </View>
          <View className="mt-3 mb-2">
            <ActionsList isContributor={true} onPress={handleSelected} />
          </View>
          <View className="mx-5 mt-2 p-1">
            <Text className="font-bold text-blue-800 text-xl">
              Recent Transactions
            </Text>
            <Transactions transactions={transactions} />
          </View>
        </View>
        <StudentSearchActionSheet onClose={handleOnclose} show={showSearch} />
      </SafeAreaView>
    </ScrollView>
  );
}
