import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetTextInput
} from '@gorhom/bottom-sheet';
import AnimatedLoader from 'react-native-animated-loader';
import { XMark } from '@nandorojo/heroicons/24/outline';
import { TextInput } from 'react-native-paper';
import { storeColors } from '../theme'


const {width, height} = Dimensions.get('window');
const BottomTopUpSheet = ({amount, show,  onClose}) => {
  const [index, setIndex] = useState(1);
  const [title, setTitle] = useState('Top Up Card');
  const [loaderTitle, setLoaderTitle] = useState('Validating card...');
  const bottomSheetRef = useRef(null);
  const fieldRef =useRef();

  const snapPoints = useMemo(() => ['25%', '30%'], []);
  const handleSheetChanges = useCallback(index => {
    setIndex(index);
    if (index === -1) {
      //onClose();
    }
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);


  const handlePayment = (card, amount) => {
    const data = {
      amount: amount,
      cardNo: card,
    };
  };

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
    const disable = false;
    return (
      <BottomSheetFooter {...props} bottomInset={10}>
        <View className="flex mb-5 flex-row justify-end mx-10 space-x-4">
          <TouchableOpacity
            onPress={handleClosePress}
            className="flex-1 h-14 border rounded-lg border-green items-center justify-center">
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            //onPress={() => handlePayment(card, paymentAmount)}
            className="flex-1 h-14 border rounded-lg border-green items-center justify-center"
            >
            <Text style={{color:""}} className="text-xl text-green ">Top-Up</Text>
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
      backgroundStyle={{backgroundColor: '#2b68f5', color: '#fff'}}
      style={styles.sheetContainer}
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={styles.actionSheetContentContainer}>
        <View style={styles.header}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity onPress={handleClosePress}>
            <XMark color="black"/>
          </TouchableOpacity>
        </View>
        <View style={styles.scanInstructionsContainer}>
        <BottomSheetTextInput keyboardType='numeric' style={styles.input} />
          </View>
        <AnimatedLoader
          visible={false}
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
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
  },
});
export default BottomTopUpSheet;
