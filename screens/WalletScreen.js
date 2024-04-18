import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowPathRoundedSquare, BellAlert } from '@nandorojo/heroicons/24/outline';
import { storeColors } from '../theme'
import {formatCreditCardNumber} from "../utils"
import Transactions from '../components/Transactions';
import BottomTopUpSheet from '../components/BottomTopUpSheet';
import ActionsList from '../components/ActionsList';
import { useSelector } from 'react-redux'

export default function WalletScreen() {


  const route = useRoute();
  const navigation =  useNavigation()
  const {student} =  route.params;
  const [action, setAction] =  useState();

  const {fetching, transactions } = useSelector(
    store => store.transactions,
  ); 

  const {userData } = useSelector(
    store => store.auth,
  ); 

  const handleSelected = (value)=>{
      setAction(value)
  }
  const handleOnTopUpClose = ()=>{
    setAction(null)
  }
  return (
    <View className="flex h-screen p-2 bg-white">
      <View className="flex flex-row  justify-between">
        <TouchableOpacity 
          onPress={()=>navigation.goBack()}
          className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
          <ArrowLeft color="black" />
        </TouchableOpacity>
        <View className="content-center justify-center items-center">
          <Text style={{color: storeColors.blue}} className="font-bold text-4xl">Hi!</Text>
          <Text style={{color: storeColors.blue}} className="text-grayText text-xl font-semibold">{userData.user.fullName}</Text>
        </View>
        <View className="flex flex-row">
          <TouchableOpacity className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
            <BellAlert color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="bg-blue  h-56 w-full p-3 self-center  mt-5 rounded-xl">
        <View className="flex flex-row justify-between">
          <Text style={{color: storeColors.white}} className="mt-2 font-bold text-lg">{student.fullName.toUpperCase()}</Text>
          <TouchableOpacity className="h-10 w-10 flex justify-center bg-cloud rounded-full items-center">
          <ArrowPathRoundedSquare color="black"/>
          </TouchableOpacity>
        </View>
        <View className="mb-2">
          <Text style={{color: storeColors.white}} className="text-lg">{student.school.name}</Text>
        </View>
        <View className="mt-1">
          
          <View className="flex flex-row space-x-1">
          <Text  style={{color: storeColors.white}} className="font-semibold mr-3 mt-1">Balance:</Text>
            <Text style={{color: storeColors.white}} className="text-lg font-semibold">UGX</Text>
            <Text style={{color: storeColors.white}} className="text-2xl font-extrabold">{student.wallet.balance.toLocaleString()}</Text>
          </View>
          <View className="flex flex-row space-x-1">
          <Text  style={{color: storeColors.white}} className="font-semibold mr-3 mt-1">Daily Limit:</Text>
            <Text style={{color: storeColors.white}} className="text-lg font-semibold">UGX</Text>
            <Text style={{color: storeColors.white}} className="text-2xl font-extrabold">{student.wallet.maximumDailyLimit.toLocaleString()}</Text>
          </View>
        </View>
        <View className="container w-full justify-between">
        <Text 
            style={{color: storeColors.white}}
            className="font-thin text-4xl mt-2">
            {formatCreditCardNumber(student.wallet.cardNo)}</Text>
        </View>
      </View>
      <View className="flex flex-auto content-center self-center h-16  space-y-2 mt-10">
          <ActionsList 
            action={action}
            onPress={handleSelected}/>
      </View>
      <View className="mt-10">
        <View className="flex mb-5 flex-row mx-3 justify-between items-end">
          <Text  style={{color: storeColors.text}} className="text-2xl font-bold" >Recent Transactions</Text>
          <Text  className="underline" style={{color:"blue"}}>View All</Text>
        </View>
        <Transactions transactions={transactions}/>
      </View>
      <BottomTopUpSheet 
        wallet={student.wallet}
        onClose={handleOnTopUpClose}
        show={action==='topup'}/>
    </View>
  )
}