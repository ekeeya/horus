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
import { makePayment, setPaid } from "../../store/payment";
import {setOrder} from '../../store/orders';
import InventoryService from "../../services/InventoryService";
import { updateInventory } from "../../store/inventory";

const {width} = Dimensions.get('window');
const PaymentConfirmationSheet = ({amount, show, onClose}) => {
  const [index, setIndex] = useState(1);
  const [wallet, setWallet] = useState();
  const [title, setTitle] = useState('Scan Card');

  const [loaderTitle, setLoaderTitle] = useState('Validating card...');
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handleSheetChanges = useCallback(index => {
    setIndex(index);
    if (index === -1) {
      onClose();
    }
  }, []);

  const dispatch = useDispatch();
  const {processing, paying, paid, cardDetails} = useSelector(
    store => store.payment,
  );
  const {total, orderItems, order} = useSelector(store => store.orders);
  const {userData} = useSelector(store => store.auth);
  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderCardStatus = status => {
    return {
      DISABLED: 'red',
      ACTIVE: 'green',
      PENDING: 'orange',
      SUSPENDED: 'red',
    };
  };
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
    handleClosePress();
    onClose(true);
  };

  useEffect(() => {
    if (paid) {
      bottomSheetRef.current?.close();
      dispatch(updateInventory(order));
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
      handleClosePress();
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
        <View className="flex flex-row  justify-center space-x-2 m-10">
          <TouchableOpacity
            onPress={() => editOrder()}
            className="flex flex-row justify-center w-56 space-x-5 items-center border border-red-600 h-10 px-6">
            <Text className="text-red-600 font-bold text-2xl">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={disable}
            className={`flex flex-row justify-center w-56 space-x-5 items-center border ${
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
      backgroundStyle={{backgroundColor: '#167D7F', color: '#fff'}}
      style={styles.sheetContainer}
      backdropComponent={renderBackdrop}
      footerComponent={wallet ? renderFooter : null}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={styles.actionSheetContentContainer}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity onPress={handleClosePress}>
            <Ionicons name="close-circle-outline" size={30} />
          </TouchableOpacity>
        </View>
        {wallet ? (
          <>
            <View style={styles.cardView}>
              <View style={styles.roundImageContainer}>
                <Image
                  source={require('../../assets/logos/logo.png')}
                  style={styles.roundImage}
                />
              </View>
              <View style={styles.cardDetails}>
                <Text
                  style={{fontWeight: 'bold', color: '#ffff', fontSize: 18}}>
                  Card No.
                </Text>
                <Text style={styles.cardNoText}>
                  {formatCreditCardNumber(wallet.cardNo)}
                </Text>
              </View>
            </View>
            <Text style={styles.studentTitleText}>Order Details</Text>
            <View style={styles.studentContainer}>
              <View style={styles.studentIconContainer}>
                <Image
                  source={require('../../assets/student.png')}
                  style={styles.studentIcon}
                />
              </View>
              <View style={styles.studentDetails}>
                <Text style={styles.nameText}>{cardDetails.fullName}</Text>
                <Text style={{color: '#3b3f4d'}}>{cardDetails.className}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text>Balance:</Text>
                  <Text style={{color: '#3b3f4d'}}>
                    {wallet.balance.toLocaleString()}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text>Status:</Text>
                  <Text
                    style={{
                      color: renderCardStatus(wallet.status)[wallet.status],
                      fontWeight: '600',
                    }}>
                    {wallet.status}
                  </Text>
                  {wallet.status !== 'ACTIVE' && (
                    <Text
                      style={{
                        fontSize: 10,
                        margin: 5,
                        fontWeight: '500',
                        color: 'red',
                      }}>
                      (Can't Pay with a card in this state)
                    </Text>
                  )}
                </View>
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
            <View style={styles.textContainer}>
              <Text style={styles.instructionText}>
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
  sheetContainer: {
    // add horizontal space
    marginHorizontal: 0,
    elevation: 10,
  },
  actionSheetContentContainer: {
    flex: 1,
    backgroundColor: '#fafafc',
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
  cardView: {
    backgroundColor: '#111a2c',
    marginTop: 20,
    height: width / 3.5,
    marginHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardDetails: {
    marginTop: 5,
  },
  roundImageContainer: {},
  roundImage: {
    marginHorizontal: 10,
    height: 80,
    width: 80,
  },
  cardNoText: {
    color: '#f4f4fa',
    paddingVertical: 5,
    fontWeight: '500',
    fontSize: 16,
  },
  studentContainer: {
    flexDirection: 'row',
  },
  studentTitleText: {
    marginHorizontal: 20,
    marginVertical: 10,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    color: '#3b3f4d',
  },
  studentIconContainer: {
    marginHorizontal: 20,
    borderStyle: 'solid',
    borderWidth: 2,
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ebebf2',
  },
  studentIcon: {
    height: 40,
    width: 40,
  },
  studentDetails: {},
  nameText: {
    color: '#3b3f4d',
    fontWeight: 'bold',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
  textContainer: {
    flex: 1,
    marginTop: 5,
  },
  image: {
    height: '90%',
    width: '90%',
    resizeMode: 'cover',
    borderRadius: 10,
    borderWidth: 1,
  },
  instructionText: {
    //color: "#11192b",
    textAlign: 'center',
  },
  lottie: {
    width: 100,
    height: 100,
  },
});
export default PaymentConfirmationSheet;
