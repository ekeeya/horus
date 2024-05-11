import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {formatCreditCardNumber} from '../utils';
import {storeColors} from '../theme';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function WalletCard(props) {
  const navigation = useNavigation();

  const {item, idx, count, createClicked} = props;
  const [isFavourite, setFavourite] = useState(false);
  let image = require('../assets/images/credit-card-3.png');
  if (idx % 2 > 0) {
    image = require('../assets/images/credit-card-2.jpg');
  }

  const goToWalletScreen = () => {
    navigation.navigate('Wallet', {student: item});
  };

  return item.isEmpty ? (
    <TouchableOpacity
      onPress={() => createClicked()}
      style={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 25,
        borderColor: storeColors.grayText,
      }}
      className={`relative ${count === 1 ? 'mx-2' : 'mx-2'}`}>
      <View className="w-96 h-56 rounded-3xl bg-white justify-center items-center">
        <Icon
          color={storeColors.grayText}
          size={60}
          name="add-circle-outline"
        />
        <Text className="font-bold mt-2">Tap To Search Your Student</Text>
      </View>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => goToWalletScreen()}
      className={`relative ${count === 1 ? 'mx-4' : 'mx-2'}`}>
      <Image
        resizeMode="cover"
        source={image}
        className="w-96 h-56 rounded-3xl"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.6)']}
        className="absolute p-4 h-full w-full flex justify-between rounded-3xl">
        <ScrollView showsVerticalScrollIndicator={false} className="w-auto">
          <View className="flex-row justify-between items-center px-1">
            <Text
              style={{color: storeColors.white}}
              className="font-bold text-base uppercase">
              {item.fullName}
            </Text>
            <View
              onPress={() => setFavourite(!isFavourite)}
              className="rounded-full">
              <Image
                source={require('../assets/images/student.png')}
                className="w-10 h-10"
              />
            </View>
          </View>
          <View className="mx-3 mt-16 mb-2">
            <Text
              style={{color: storeColors.white}}
              className="font-bold text-xl">
              {formatCreditCardNumber(item.wallet.cardNo)}
            </Text>
          </View>
          <View className="space-y-1 mx-3">
            <View className="flex-row items-center space-x-2">
              <Text
                style={{color: storeColors.white}}
                className="text-white font-extrabold">
                Balance:
              </Text>
              <Text
                style={{color: storeColors.white}}
                className="text-sm text-gray-300 font-semibold">
                {item.wallet.balance.toLocaleString()} /=
              </Text>
            </View>
            <Text
              style={{color: storeColors.white}}
              className="text-sm font-bold text-gray-200">
              {item.school.name}
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </TouchableOpacity>
  );
}
