import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {storeColors} from '../theme';
import Beneficiaries from '../components/Beneficiaries';
import Transactions from '../components/Transactions';
import {useDispatch, useSelector} from 'react-redux';
import {fetchStudents} from '../store/students';
import {fetchTransactions} from '../store/transactions';
import colors from 'tailwindcss/colors';
import DynamicIcon from '../components/DynamicIcon';
import {setShowTopUp} from '../store/wallet';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {handleLogout, updatePassword} from '../store/auth';
import {useNavigation} from '@react-navigation/native';
import Modal from 'react-native-modal';
import {TextInput} from 'react-native-paper';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

export default function DashboardScreen() {
  const [showSearch, setShowSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {students, loading, selectedStudent} = useSelector(
    store => store.students,
  );

  const {updating} = useSelector(store => store.auth);

  const {userData} = useSelector(store => store.auth);
  const {transactions, fetching} = useSelector(store => store.transactions);

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchTransactions({}));
  }, [dispatch]);

  const handleCreateClicked = () => {
    setShowSearch(true);
  };

  const handleOnTopUpClose = value => {
    dispatch(setShowTopUp(false));
    dispatch(fetchTransactions({}));
  };

  useEffect(() => {
    if (!userData) {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [userData]);
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 6000);
    }
  }, [error]);
  const changePassword = () => {
    if (password.length > 0 && newPassword.length > 0) {
      if (password === newPassword) {
        const payload = {newPassword: password, id: userData.user.id};
        console.log(payload);
        dispatch(updatePassword(payload));
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Required',
          textBody: 'Passwords do not match!',
        });
        setError('Passwords do not match!');
      }
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Required',
        textBody: 'Make sure new password is filled!',
      });
      setError('Make sure new password is filled!');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setPassword('');
    setNewPassword('');
  };
  return (
    userData && (
      <ScrollView className="w-full bg-custom-lightblue flex-1">
        <Modal avoidKeyboard={true} isVisible={showModal}>
          <View
            style={{backgroundColor: '#f2f5fe'}}
            className="flex bg-gray-100 rounded p-2">
            <View className="flex flex-row items-center justify-between">
              <Text />
              <Text className="font-bold text-lg">Update Password</Text>
              <TouchableOpacity onPress={() => handleClose()}>
                <DynamicIcon
                  name="times"
                  size={20}
                  provider="FontAwesome5"
                  color={colors.blue['800']}
                />
              </TouchableOpacity>
            </View>
            <View className="mt-2">
              <View className="mt-2">
                <TextInput
                  className="mt-5"
                  label="New Password"
                  mode="focused"
                  onChangeText={setPassword}
                  value={password}
                  secureTextEntry
                  contentStyle={{backgroundColor: '#f2f5fe'}}
                  underlineColor={colors.blue['600']}
                  selectionColor={colors.blue['800']}
                  outlineColor={colors.white}
                  activeUnderlineColor={colors.blue['600']}
                />
                <TextInput
                  className="mt-5"
                  label="Confirm Password"
                  mode="focused"
                  onChangeText={setNewPassword}
                  value={newPassword}
                  secureTextEntry
                  contentStyle={{backgroundColor: '#f2f5fe'}}
                  underlineColor={colors.blue['600']}
                  selectionColor={colors.blue['800']}
                  outlineColor={colors.white}
                  activeUnderlineColor={colors.blue['600']}
                />
              </View>
              {error && (
                <View className="flex items-center justify-center">
                  <Text className="text-red-600 text-xs">{error}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={() => changePassword()}
                className="flex flex-row justify-center space-x-5 items-center border border-blue-700 h-12 py-2 px-2 mt-5 mb-5">
                <Text
                  style={{color: colors.blue['800']}}
                  className="font-bold text-2xl">
                  Change Password
                </Text>
                {updating ? (
                  <ActivityIndicator size="small" color={colors.blue['600']} />
                ) : (
                  <DynamicIcon
                    name="arrow-right-alt"
                    size={22}
                    provider="MaterialIcons"
                    color={colors.blue['800']}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <SafeAreaView>
          <View className="container">
            <View className="flex flex-row justify-between mt-8 mb-8">
              <View className="p-1 mx-3">
                <Text
                  style={{color: storeColors.blue}}
                  className="font-bold text-lg">
                  Hi, {userData.user.firstName}
                </Text>
                <Text className="font-bold">Welcome back</Text>
              </View>
              <View className="mx-4">
                <Menu>
                  <MenuTrigger>
                    <View className="h-8 w-8 bg-gray-200 justify-center items-center rounded-full">
                      <DynamicIcon
                        name="more-horizontal"
                        size={20}
                        provider="Feather"
                        color={colors.blue['800']}
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={() => {
                        dispatch(fetchStudents());
                      }}>
                      <View className="mt-2">
                        <Text>Refresh</Text>
                      </View>
                    </MenuOption>
                    <MenuOption onSelect={() => setShowModal(true)}>
                      <View className="mt-2">
                        <Text>Update Password</Text>
                      </View>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        Alert.alert(
                          'Continue?',
                          'Are you sure you want to logout?',
                          [
                            {
                              text: 'Cancel',
                              onPress: () => console.log('Cancel Pressed'),
                              style: 'cancel',
                            },
                            {
                              text: 'LOGOUT',
                              onPress: () => {
                                dispatch(handleLogout());
                                navigation.reset({
                                  index: 0,
                                  routes: [{name: 'Login'}],
                                });
                              },
                            },
                          ],
                        );
                      }}>
                      <View className="mt-2">
                        <Text style={{color: 'red'}}>Sign Out</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>
            </View>

            {loading ? (
              <View className="justify-center items-center">
                <ActivityIndicator size="small" color={colors.blue['800']} />
              </View>
            ) : (
              <Beneficiaries
                onCreateClicked={handleCreateClicked}
                beneficiaries={students}
              />
            )}
            {selectedStudent.id && (
              <>
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
                      <Text className="font-bold text-gray-400">
                        {selectedStudent.wallet.balance.toLocaleString()}/=
                      </Text>
                    </View>
                  </View>
                  <View className="border border-gray-500 bg-gray-500 h-10" />
                  <View className="mx-3">
                    <View className="flex my-1 bg-white rounded-lg flex-row items-center space-x-2 justify-start">
                      <DynamicIcon
                        name="arrow-forward-outline"
                        size={20}
                        provider="Ionicons"
                        color={colors.green['800']}
                      />
                      <Text className="text-xs text-green-600 mx-1 font-bold">
                        UGX
                      </Text>
                      <Text className="text-green-700 mx-1 font-bold">
                        {selectedStudent.wallet.totalIn.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex bg-white rounded-lg flex-row items-center space-x-2 justify-start">
                      <DynamicIcon
                        name="arrow-back-outline"
                        size={20}
                        provider="Ionicons"
                        color={colors.red['800']}
                      />
                      <Text className="text-xs text-red-600 font-bold">
                        UGX
                      </Text>
                      <Text className="text-red-700 font-bold">
                        {selectedStudent.wallet.totalOut.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View className="mx-5 mt-5 p-1">
              <View className="flex flex-row justify-between">
                <Text className="font-bold text-blue-800 text-xl">
                  Recent Transactions
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    dispatch(fetchTransactions());
                  }}>
                  <DynamicIcon
                    name="refresh"
                    size={20}
                    provider="Foundation"
                    color={colors.blue['800']}
                  />
                </TouchableOpacity>
              </View>

              {fetching ? (
                <View className="flex mt-4 justify-center items-center">
                  <ActivityIndicator size="small" />
                </View>
              ) : (
                <Transactions transactions={transactions} />
              )}
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    )
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
