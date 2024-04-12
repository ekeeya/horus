import { View, Text, Button } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowPathRoundedSquare, BellAlert } from '@nandorojo/heroicons/24/outline';
import { storeColors } from '../theme'
import {formatCreditCardNumber} from "../utils"
import Transactions from '../components/Transactions';
export default function WalletScreen() {

  const route = useRoute();
  const {wallet} =  route.params;
  const transactions = [
    {
        id: 1,
        type: 'DEPOSIT',
        createdAt: new Date(),
        status:"PENDING",
        cardNo:"3700012386804900",
        amount: 50000
    },
    {
        id: 2,
        type: 'DEPOSIT',
        status:"SUCCESS",
        createdAt: new Date(),
        cardNo:"6534567384849199",
        amount: 40000
    },
    {
        id: 3,
        type: 'DEPOSIT',
        status:"FAILED",
        cardNo:"6534567384849199",
        createdAt: new Date(),
        amount: 20000
    },
    {
      id: 4,
      type: 'DEPOSIT',
      status:"SUCCESS",
      cardNo:"6534567384849199",
      createdAt: new Date(),
      amount: 20000
  },
  
  ];

  return (
    <View className="flex h-screen p-2 bg-white">
      <View className="flex flex-row  justify-between">
        <View className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
          <ArrowLeft color="black" />
        </View>
        <View className="content-center justify-center items-center">
          <Text style={{color: storeColors.blue}} className="font-bold text-4xl">Hi!</Text>
          <Text style={{color: storeColors.blue}} className="text-grayText text-xl font-semibold">Erisa Bridget</Text>
        </View>
        <View className="flex flex-row">
          <View className="h-10 w-10 flex justify-center rounded-full items-center bg-cloud">
            <BellAlert color="black" />
          </View>
        </View>
      </View>
      <View className="bg-blue  h-56 w-full p-3 self-center  mt-5 rounded-xl">
        <View className="flex flex-row justify-between">
          <Text style={{color: storeColors.white}} className="mt-2 font-bold text-lg">{wallet.studentName.toUpperCase()}</Text>
          <View className="h-10 w-10 flex justify-center bg-cloud rounded-full items-center">
          <ArrowPathRoundedSquare color="black"/>
          </View>
        </View>
        <View className="mb-2">
          <Text style={{color: storeColors.white}} className="text-lg">{wallet.school.name}</Text>
        </View>
        <View className="mt-1">
          <Text style={{color: storeColors.white}} className="font-semibol">Balance</Text>
          <View className="flex flex-row space-x-1">
            <Text style={{color: storeColors.white}} className="text-lg font-semibold">UGX</Text>
            <Text style={{color: storeColors.white}} className="text-2xl font-extrabold">2,000,000.00</Text>
          </View>
        </View>
        <View className="container w-full justify-between">
        <Text 
            style={{color: storeColors.white}}
            className="font-thin text-4xl mt-5">
            {formatCreditCardNumber(wallet.cardNo)}</Text>
        </View>
      </View>
      <View className="flex justify-center mt-10 items-center">
          <Button
            title="Top Up"
          />
      </View>
      <View className="mt-10">
        <View className="flex mb-5 flex-row mx-3 justify-between items-end">
          <Text  style={{color: storeColors.text}} className="text-2xl font-bold" >Recent Transactions</Text>
          <Text  className="underline" style={{color:"blue"}}>View All</Text>
        </View>
        <Transactions transactions={transactions}/>
      </View>
    </View>
  )
}