import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Dimensions,
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
} from '../../store/payment';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {cleanTag} from '../../utils';
import {clearOrderItems} from '../../store/orders';
const {width} = Dimensions.get('screen');

//const smallScreen = width < 412;
const smallScreen = true;
// const shortScreen = height < 700;
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

  const resetStore = () => {
    setCardNo(null);
    dispatch(resetCardDetails());
    dispatch(setPaid(false));
    dispatch(resetError());
    dispatch(clearOrderItems());
  };

  useEffect(() => {
    if (cardNo) {
      dispatch(getCard(cardNo));
    }
  }, [cardNo]);

  return (
    <View className="flex flex-1" style={{backgroundColor: '#e9e9eb'}}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View
        className={`bg-white flex flex-row justify-between ${
          smallScreen ? 'p-0 h-10' : 'p-2 h-20'
        }`}>
        <TouchableOpacity
          onPress={() => {
            resetStore();
            navigation.reset({
              index: 0,
              routes: [{name: 'Dashboard'}],
            });
          }}
          className={`bg-gray-100 rounded-full ${
            smallScreen ? 'h-8 w-8 mx-2' : 'h-10 w-10'
          }`}>
          <DynamicIcon
            name="chevron-left"
            size={smallScreen ? 30 : 40}
            provider="MaterialIcons"
            color={colors.black}
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">Order #2145</Text>
        <TouchableOpacity
          className={`bg-gray-100 rounded-full ${
            smallScreen ? 'h-8 w-8 mx-2' : 'h-10 w-10'
          }`}>
          <DynamicIcon
            name="information-outline"
            size={smallScreen ? 30 : 40}
            provider="Ionicons"
            color={colors.black}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{elevation: 2}}
        className={`flex flex-row justify-between items-center bg-white rounded-xl ${
          smallScreen ? 'mt-2 h-14 mx-2' : 'mt-5 h-20 mx-4'
        }`}>
        <View className="flex flex-row">
          <View className="p-2 mx-3 rounded-full items-center h-10 w-10 bg-church-150">
            <DynamicIcon
              name="flag"
              size={smallScreen ? 25 : 30}
              provider="Ionicons"
              color={colors.purple['500']}
            />
          </View>
          <View className="space-y-1">
            <Text className="font-semibold text-black">
              {userData.user.userSchool.name}
            </Text>
            <Text
              className={`text-gray-700 font-light ${
                smallScreen && 'text-xs'
              }`}>
              {userData.user.posCenter.name}
            </Text>
          </View>
        </View>
        <DynamicIcon
          name="chevron-right"
          size={smallScreen ? 25 : 30}
          provider="MaterialIcons"
          color={colors.black}
        />
      </TouchableOpacity>
      {cardDetails.wallet && (
        <View
          style={{elevation: 1}}
          className={`flex flex-row justify-between items-center bg-white rounded-xl ${
            smallScreen ? 'mt-2 h-20 mx-2' : 'mt-5 h-28 mx-4'
          }`}>
          <View className="flex flex-row">
            <View
              className={`${
                smallScreen ? 'p-1 mx-2 h-14 w-14' : 'p-2 mx-3 h-20 w-20'
              } rounded-full justify-center items-center bg-church-150`}>
              <Image
                source={require('../../assets/student.png')}
                className={`${smallScreen ? 'h-10 w-10' : 'h-14 w-14'}`}
              />
            </View>
            <View className="space-y-1">
              <Text
                className={`${
                  smallScreen ? 'text-xs' : 'text-normal'
                } font-semibold text-black`}>
                {cardDetails.fullName} ({cardDetails.className})
              </Text>
              <Text
                className={`${
                  smallScreen ? 'text-xs' : 'text-normal'
                } text-gray-700 font-light`}>
                {cardDetails.school.name}
              </Text>
              <Text
                className={`font-semibold text-black ${
                  smallScreen ? 'text-normal' : 'text-xl'
                }`}>
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
      <View className={`bg-white flex-1 ${smallScreen ? 'mt-3' : 'mt-10'}`}>
        <Text
          className={`text-black mx-2 font-bold ${
            smallScreen ? 'text-lg mt-1' : 'text-2xl mt-2'
          }`}>
          Items
        </Text>
        <View
          className={`border-b-2 border-purple-600 ${
            smallScreen ? 'mt-2 h-1/2' : 'mt-5 h-1/2'
          }`}>
          <LongOrderItems items={orderItems} />
        </View>
        <View
          className={`${
            smallScreen ? 'mt-1 p-1' : 'mt-5 p-2'
          } border mx-2 rounded-xl border-gray-200 h-auto`}>
          <View className="border-b h-10 border-b-gray-200">
            <Text
              className={`text-black mx-2 font-bold ${
                smallScreen ? 'text-lg mt-1' : 'text-2xl mt-2'
              }`}>
              Details
            </Text>
          </View>
          <View className={`flex ${smallScreen ? 'mt-1' : 'mt-2'}`}>
            <View className="flex flex-row p-2 justify-between">
              <Text
                className={`${
                  smallScreen ? 'text-normal' : 'text-lg'
                } font-semibold`}>
                Total
              </Text>
              <Text
                className={`text-black font-semibold ${
                  smallScreen ? 'text-xl' : 'text-2xl'
                }`}>
                {total.toLocaleString()}/=
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View className="absolute bottom-0 left-0 w-full p-2">
        <TouchableOpacity
          onPress={() => openScanner()}
          className={`flex justify-center items-center bg-purple-500 rounded-full ${
            smallScreen ? 'h-12  py-1 px-3 mb-2' : 'h-16  py-3 px-6 mb-4'
          }`}>
          <View className="flex flex-row content-center space-x-2">
            <Text
              className={`text-white font-bold ${
                smallScreen ? 'text-2xl' : 'text-3xl'
              }`}>
              Proceed
            </Text>
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
