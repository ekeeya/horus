import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'react-native-linear-gradient'
import {formatCreditCardNumber} from "../utils"
import { storeColors } from '../theme'
import {useNavigation} from '@react-navigation/native';

export default function WalletCard(props) {

  const navigation = useNavigation();

  const {wallet, idx} =  props
    const [isFavourite, setFavourite] = useState(false);
    let image = require("../assets/images/credit-card-1.jpg");
    if (idx % 2 > 0){
      image = require("../assets/images/credit-card-2.jpg");
    }

    const goToWalletScreen = () => {
      navigation.navigate('Wallet', {wallet:wallet});
    };

  return (
    <TouchableOpacity 
      onPress={()=>goToWalletScreen()}
      className="mr-4 relative">
      <Image resizeMode='cover' source={image}  className="w-80 h-56 rounded-3xl"/>
      <LinearGradient colors={['transparent', 'rgba(0, 0, 0, 0.6)']} 
        className="absolute p-4 h-full w-full flex justify-between rounded-3xl">
       
       <ScrollView showsVerticalScrollIndicator={false} className="w-auto">
       <View className="flex-row justify-between items-center px-1">
            <Text style={{color: storeColors.white}}
             className="font-bold text-base uppercase">{wallet.studentName}</Text>
            <View
                onPress={()=> setFavourite(!isFavourite)}
                className="rounded-full"
            >
                <Image source={require("../assets/images/student.png")}  className="w-10 h-10"/>
            </View>
        </View>
        <View className="mx-3 mt-16 mb-2">
          <Text 
            style={{color: storeColors.white}}
            className="font-bold text-xl">
            {formatCreditCardNumber(wallet.cardNo)}</Text>
        </View>
        <View className="space-y-1 mx-3">
            <View className="flex-row items-center space-x-2">
                <Text style={{color: storeColors.white}} className="text-white font-extrabold" >Balance:</Text>
                <Text style={{color: storeColors.white}} className="text-sm text-gray-300 font-semibold">
                   {wallet.balance.toLocaleString()} /=
                </Text>
            </View>
            <Text style={{color: storeColors.white}} className="text-sm font-bold text-gray-200">
                {wallet.school.name}
            </Text>
        </View>
       </ScrollView>
      </LinearGradient>
    </TouchableOpacity>
  )
}