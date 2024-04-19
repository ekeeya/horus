import { View, Text, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'react-native-linear-gradient'
import {Bars3CenterLeft, Bell} from '@nandorojo/heroicons/24/solid'
import {storeColors} from '../theme';
import SchoolsList from '../components/SchoolsList'
import Beneficiaries from '../components/Beneficiaries'
import Transactions from '../components/Transactions'
import { useDispatch, useSelector } from 'react-redux'
import { fetchStudents, fetchSchools } from '../store/students'
import { fetchTransactions } from '../store/transactions'
import StudentSearchActionSheet from '../components/StudentSearchActionSheet'


export default function DashboardScreen() {

  const [showSearch, setShowSearch] =  useState(false);

  const dispatch = useDispatch();

  const {loading, students, schools } = useSelector(
    store => store.students,
  ); 
  const {fetching, transactions } = useSelector(
    store => store.transactions,
  ); 

  useEffect(()=>{
    dispatch(fetchSchools())
    dispatch(fetchStudents());
    dispatch(fetchTransactions({}))
  }, []);

  const handleCreateClicked  = ()=>{
    setShowSearch(true)
  }
  const handleOnclose = ()=>{
    setShowSearch(false)
  }

  return (
    <LinearGradient
      colors={['#ffff', '#f2f2f2']}
      //colors={['rgba(58, 131, 244,0.4)', 'rgba(9, 181, 211, 0.4)']}
      className="w-full flex-1"
    >
      <SafeAreaView>
        <View className="container">
          <View className="flex-row mt-5 justify-between items-center px-4">
          <TouchableOpacity className="bg-grayText h-10 w-10 justify-center items-center rounded-full">
              <Bars3CenterLeft color={storeColors.white} />
            </TouchableOpacity>
            <TouchableOpacity className="bg-grayText h-10 w-10 justify-center items-center rounded-full">
             <Bell color={storeColors.white}  />
            </TouchableOpacity>
          </View>
           
          {/* schools */}
         <View className="space-y-4 mt-4">
            <SchoolsList schools={schools}/>
          </View>

          {/* cards row  */}
          <Beneficiaries 
            onCreateClicked={handleCreateClicked}
            beneficiaries={students}/>

          {/* top action transactions list */}
          <View className="mt-1">
            <View className="flex-row justify-between items-center mb-2">
              <Text
                  style={{color: storeColors.text}}
                  className="ml-4 mt-2 underline text-lg font-bold">
                    Recent  Transactions
              </Text>
              <TouchableOpacity className="mr-4 mt-2">
                <Text className="text-blue-600 font-bold">
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <Transactions transactions={transactions}/>
          </View>
        </View>
        <StudentSearchActionSheet 
          onClose={handleOnclose}
          show={showSearch} />
      </SafeAreaView>   

    </LinearGradient>
      
  )
}