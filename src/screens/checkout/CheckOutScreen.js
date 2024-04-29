import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import DynamicIcon from '../../components/DynamicIcon';
import colors from 'tailwindcss/colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import LongOrderItems from '../../components/inventory/LongOrderItems';
import PaymentConfirmationSheet from '../../components/payment/PaymentConfirmationSheet';
import {
  getCard,
  getTransactions,
  resetCardDetails,
  resetError,
  setPaid,
  setPaymentAmount,
} from '../../store/payment';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {cleanTag} from '../../utils';
import {clearOrderItems} from '../../store/orders';

export const CheckOutScreen = () => {
  const navigation = useNavigation();
  const {orderItems, total} = useSelector(store => store.orders);
  const {userData} = useSelector(store => store.auth);
  const {cardDetails} = useSelector(store => store.payment);

  const [showScanner, setShowScanner] = useState(false);
  const [cardNo, setCardNo] = useState(null);
  const dispatch = useDispatch();
  const readNdef = async () => {
    if (total === 0) {
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Error',
        textBody: 'Please first select or type in an amount!',
        button: 'Dismiss',
        autoClose: 5000,
      });
    } else {
      try {
        console.log('Scanning for NFC tags');
        // register for the NFC tag with NDEF in it
        await NfcManager.requestTechnology(NfcTech.Ndef);
        // the resolved tag object will contain `ndefMessage` property
        const tag = await NfcManager.getTag();
        const tagValue = Ndef.uri
          .decodePayload(tag.ndefMessage[0].payload)
          .toString();
        setCardNo(cleanTag(tagValue));
      } catch (ex) {
        Alert.alert(`Oops, could not read the tag: ${ex}`);
      } finally {
        // stop the nfc scanning
        await NfcManager.cancelTechnologyRequest();
      }
    }
  };
  const handlePaymentsSheetOnClose = (edit = false) => {
    setShowScanner(false);
    if (!edit) {
      setCardNo(null);
      dispatch(resetCardDetails());
      dispatch(setPaid(false));
      dispatch(resetError());
      dispatch(clearOrderItems());
      dispatch(getTransactions(userData.user.id));
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
    }
  };

  const openScanner = async () => {
    setShowScanner(true);
    await readNdef();
  };

  useEffect(() => {
    if (cardNo) {
      dispatch(getCard(cardNo));
    }
  }, [cardNo]);

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
            <Text className="font-semibold text-black">
              {userData.user.userSchool.name}
            </Text>
            <Text className="text-gray-700 font-light">
              {userData.user.posCenter.name}
            </Text>
          </View>
        </View>
        <DynamicIcon
          name="chevron-right"
          size={30}
          provider="MaterialIcons"
          color={colors.black}
        />
      </TouchableOpacity>
      {cardDetails.wallet && (
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
                {cardDetails.fullName} ({cardDetails.className})
              </Text>
              <Text className="text-gray-700 font-light">
                {cardDetails.school.name}
              </Text>
              <Text className="font-semibold text-black text-xl">
                {cardDetails.wallet.balance.toLocaleString()}/=
              </Text>
            </View>
          </View>
          <View className="p-3">
            {cardDetails.wallet.status === 'ACTIVE' ? (
              <Text className="font-bold text-green-600">
                {cardDetails.wallet.status}
              </Text>
            ) : (
              <Text className="font-bold text-red-600">
                {cardDetails.wallet.status}
              </Text>
            )}
          </View>
        </View>
      )}
      <View className="bg-white flex-1 mt-10">
        <Text className="text-black font-bold text-2xl mx-2 mt-2">Items</Text>
        <View className="mt-5 h-1/2 border-b-2 border-purple-600">
          <LongOrderItems items={orderItems} />
        </View>
        <View className="mt-5 border p-2 mx-2 rounded-xl border-gray-200 h-auto">
          <View className="border-b h-10 border-b-gray-200">
            <Text className="text-black font-bold text-2xl">Details</Text>
          </View>
          <View className="flex mt-2">
            <View className="flex flex-row justify-between">
              <Text className="text-lg font-semibold">Total</Text>
              <Text className="text-2xl text-black font-semibold">
                {total.toLocaleString()}/=
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 left-0 w-full p-2">
        <TouchableOpacity
          onPress={() => openScanner()}
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
      <PaymentConfirmationSheet
        show={showScanner}
        onClose={handlePaymentsSheetOnClose}
      />
    </View>
  );
};
