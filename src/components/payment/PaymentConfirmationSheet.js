import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedLoader from 'react-native-animated-loader';
import {useDispatch, useSelector} from 'react-redux';
import {formatCreditCardNumber} from '../../utils';
import {store} from '../../store/store';
import {makePayment} from '../../store/payment';
import {setOrder} from '../../store/orders';
import {updateInventory} from '../../store/inventory';
import colors from 'tailwindcss/colors';
const {width} = Dimensions.get('screen');

const smallScreen = width < 365;
// const shortScreen = height < 700;
const PaymentConfirmationSheet = ({show, onClose}) => {
  const [index, setIndex] = useState(1);
  const [wallet, setWallet] = useState();
  const [title, setTitle] = useState('Scan Card');
  const [editing, setEditing] = useState(false);

  const [loaderTitle, setLoaderTitle] = useState('Working...');
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => smallScreen  ? ['25%', '55%'] : ['25%', '50%'], []);
  const handleSheetChanges = useCallback(index => {
    setIndex(index);
  }, []);

  const dispatch = useDispatch();
  const {processing, paying, paid, cardDetails} = useSelector(
    store => store.payment,
  );
  const {total, orderItems, order} = useSelector(store => store.orders);
  // const {userData} = useSelector(store => store.auth);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose();
  }, []);
  const handlePayment = card => {
    const payload = {
      cardNo: card,
      amount: total,
      items: orderItems.map(item => {
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          categoryId: item.category.id,
        };
      }),
    };
    dispatch(makePayment(payload));
    dispatch(setOrder(payload));
  };

  const editOrder = () => {
    bottomSheetRef.current?.close();
  };

  useEffect(() => {
    if (paid) {
      bottomSheetRef.current?.close();
      dispatch(updateInventory(order));
      onClose();
    }
  }, [paid]);

  useEffect(() => {
    if (cardDetails.wallet) {
      setWallet(cardDetails.wallet);
      setTitle('Confirm Payment');
    }
  }, [cardDetails]);

  useEffect(() => {
    if (show) {
      setIndex(1);
    } else {
      setIndex(-1);
    }
  }, [show]);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  const renderFooter = useCallback(props => {
    const {cardDetails} = store.getState().payment;
    const card = cardDetails.wallet ? cardDetails.wallet.cardNo : null;
    const disable =
      cardDetails.wallet.status !== 'ACTIVE' ||
      (cardDetails.wallet && cardDetails.wallet.balance < total);
    return (
      <BottomSheetFooter {...props} bottomInset={10}>
        {cardDetails.wallet && cardDetails.wallet.balance < total && (<View className="items-center">
            <Text className="text-red-600 font-bold">
              Insufficient account balance for this order
            </Text>
          </View>
        )}
        <View
          className={`flex flex-row justify-center space-x-2 ${
            smallScreen ? 'm-3' : 'm-10'
          }`}>
          <TouchableOpacity
            onPress={() => {
              setEditing(true);
              editOrder();
            }}
            className={`flex flex-row justify-center w-1/2 space-x-5 items-center border border-red-600 ${
              smallScreen ? 'h-10 px-6' : 'h-10 px-6'
            }`}>
            <Text
              className={`text-red-600 font-bold ${
                smallScreen ? 'text-lg' : 'text-2xl'
              }`}>
              Cancel Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disable}
            className={`flex flex-row justify-center w-1/2 space-x-5 items-center border ${
              disable ? 'border-gray-400' : 'border-purple-800'
            } h-10 px-6`}
            onPress={() => handlePayment(card)}>
            <Text
              className={`${
                disable ? 'text-gray-600' : 'text-purple-800'
              } font-bold text-2xl`}>
              Pay
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetFooter>
    );
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}
      enablePanDownToClose={true}
      bottomInset={0}
      backgroundStyle={{backgroundColor: colors.purple['600'], color: '#fff'}}
      backdropComponent={renderBackdrop}
      footerComponent={wallet ? renderFooter : null}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View className={'flex flex-1 bg-white'}>
        <View className={'flex flex-row justify-between p-2'}>
          <Text className={`${smallScreen ? 'text-lg' : 'text-xl'} font-bold`}>
            {title}
          </Text>
          <TouchableOpacity onPress={handleClosePress}>
            <Ionicons name="close-circle-outline" size={30} />
          </TouchableOpacity>
        </View>
        {wallet ? (
          <>
            <View
              className={`bg-purple-800 ${
                smallScreen ? 'mt-0 h-12 rounded-xl' : 'mt-5 h-20 rounded-2xl'
              }  mx-2
              flex justify-start items-center flex-row`}>
              <View
                className={`bg-white flex justify-center items-center rounded-xl mx-2 ${
                  smallScreen ? 'h-10 w-14' : 'h-16 w-20'
                }`}>
                <Image
                  source={require('../../assets/student.png')}
                  className={`mx-2 ${smallScreen ? 'h-10 w-10' : 'h-16 w-16'}`}
                />
              </View>
              <View
                className={
                  'relative flex flex-row flex-grow mx-2 justify-between  h-10'
                }>
                <View className={`${smallScreen ? 'mt-1' : 'mt-3'}`}>
                  <Text
                    className={'text-normal text-center font-bold text-white'}>
                    Card No.
                  </Text>
                  <Text className={'text-xs text-white'}>
                    {formatCreditCardNumber(wallet.cardNo)}
                  </Text>
                </View>
                <View className={`${smallScreen ? 'mt-1' : 'mt-3'}`}>
                  <Text
                    className={'text-normal text-center font-bold text-white'}>
                    Status
                  </Text>
                  <Text className={'text-xs text-white font-bold'}>
                    {wallet.status}
                  </Text>
                </View>

                <View className={`${smallScreen ? 'mt-1' : 'mt-3'}`}>
                  <Text
                    className={'text-normal font-bold text-white'}>
                    Balance
                  </Text>
                  <Text className={'text-xs text-center text-white'}>
                    {wallet.balance.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
            <Text
              className={`${
                smallScreen ? 'my-1 text-sm mx-5' : 'my-2 mx-10'
              }  font-bold underline`}>
              Order Summary
            </Text>
            <View className={`flex ${smallScreen ? 'mx-5' : 'mx-10'} h-1/3`}>
              {orderItems.map((item, idx) => (
                <View
                  key={idx}
                  className="flex flex-row justify-between border-b border-b-gray-300">
                  <View className="flex flex-row justify-between space-x-2">
                    <Text className="font-bold">x{item.quantity}</Text>
                    <Text>{item.name}</Text>
                  </View>
                  <View>
                    <Text>{(item.price * item.quantity).toLocaleString()}/=</Text>
                  </View>
                </View>
              ))}
              <View className="flex, flex-row justify-between">
                <Text className="font-bold">Total</Text>
                <Text className="font-bold text-lg">
                  {total.toLocaleString()}/=
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.scanInstructionsContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../assets/8367360.jpg')}
                style={styles.image}
              />
            </View>
            <View className={'mt-1'}>
              <Text
                className={`text-center ${
                  smallScreen ? 'text-xs' : 'text-normal'
                }`}>
                For a successful scan, simply hold a payment card/bracelet close
                to the payment device until you hear a success beep. The card
                details will then appear on the screen and replace these
                instructions.
              </Text>
            </View>
          </View>
        )}
        <AnimatedLoader
          visible={processing || paying}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={styles.lottie}
          animationType="slide"
          speed={1}>
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <Text style={{fontWeight: '500'}}>{loaderTitle}</Text>
        </AnimatedLoader>
      </View>
    </BottomSheet>
  );
};
const styles = StyleSheet.create({
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#111a2c',
  },
  buttonTextContainerDisabled: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'gray',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  actionFooterText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
  footerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-evenly',
    bottom: 0,
    marginHorizontal: 15,
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: width / 9,
    flex: 1,
  },
  sendButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: width / 9,
    flex: 2,
  },
  payTitle: {
    marginHorizontal: 20,
    width: '100%',
    marginTop: 10,
  },
  titleText: {
    fontSize: 20,
    color: '#11192b',
    fontWeight: '500',
  },

  cardDetails: {
    marginTop: 5,
  },
  studentTitleText: {
    marginHorizontal: 20,
    marginVertical: 10,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    color: '#3b3f4d',
  },

  payCurrency: {
    fontWeight: '500',
    marginTop: 10,
    color: '#fff',
  },
  payAmount: {
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 24,
    color: '#fff',
  },

  scanInstructionsContainer: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderStyle: 'dashed',
  },
  image: {
    height: '90%',
    width: '90%',
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
export default PaymentConfirmationSheet;
