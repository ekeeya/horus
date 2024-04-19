import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { ArrowLeft, ArrowPathRoundedSquare, BellAlert } from '@nandorojo/heroicons/24/outline';
import AnimatedLoader from 'react-native-animated-loader';
import { storeColors } from '../theme'
import {formatCreditCardNumber} from "../utils"
import Transactions from '../components/Transactions';
import BottomTopUpSheet from '../components/BottomTopUpSheet';
import ActionsList from '../components/ActionsList';
import { useDispatch, useSelector } from 'react-redux'
import { linkToStudent } from '../store/students';
import { fetchTransactions } from '../store/transactions';

export default function WalletScreen() {


  const route = useRoute();
  const navigation =  useNavigation()
  const {student} =  route.params;
  const [action, setAction] =  useState();

  const dispatch =  useDispatch();

  const {fetching, transactions } = useSelector(
    store => store.transactions,
  ); 

 

  const {students, loading } = useSelector(
    store => store.students,
  ); 

  const isContributor =  useMemo(()=>{
   return students.some(s => s.id === student.id);
  }, [])

  const {userData } = useSelector(
    store => store.auth,
  ); 

  const handleSelected = (value)=>{
      setAction(value)
  }

  const handleOnTopUpClose = ()=>{
    setAction(null);
    dispatch(fetchTransactions({}))
  }

  useEffect(()=>{
    if(action === 'link'){
      Alert.alert('Confirm', "Are you sure you want to start contributing to this student's Wallet?", [
        {
          text: 'Cancel',
          onPress: () => setAction(null),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => {
          const params = {
            parent:userData.id,
            studentId:student.id
          }
          dispatch(linkToStudent(params));
          setAction(null)
        }},
      ]);
    }
  }, [action])
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
            isContributor={isContributor}
            action={action}
            onPress={handleSelected}/>
      </View>
      {isContributor && <View className="mt-10">
        <View className="flex mb-5 flex-row mx-3 justify-between items-end">
          <Text  style={{color: storeColors.text}} className="text-2xl font-bold" >Recent Transactions</Text>
          <Text  className="underline" style={{color:"blue"}}>View All</Text>
        </View>
        <Transactions transactions={transactions}/>
      </View>}
      <BottomTopUpSheet 
        wallet={student.wallet}
        onClose={handleOnTopUpClose}
        show={action==='topup'}/>

      <AnimatedLoader
          visible={loading}
          overlayColor="rgba(255,255,255,0.75)"
          animationStyle={{width: 100,height: 100}}
          animationType="slide"
          speed={1}>
          <Text className="font-extrabold text-white">Linking....</Text>
        </AnimatedLoader>
    </View>
  )
}