import { View, Text, TouchableOpacity, Image} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'react-native-linear-gradient'
import {Bars3CenterLeft, Bell} from '@nandorojo/heroicons/24/solid'
import {storeColors} from '../theme';
import SchoolsList from '../components/SchoolsList'
import Beneficiaries from '../components/Beneficiaries'
import Transactions from '../components/Transactions'

const schools = ['All', 'Trinity Senior','Trinity Preschool', 'Trinity Primary'];
const cards = [
  {
    id: 1,
    studentName: 'Elvis Darlington Lubowa',
    cardNo:"6534567384849199",
    balance:2000000,
    school:{id:1, name:"Trinity Primary School"}
},
{
    id: 2,
    studentName: 'Malaika Sherina Namwanje',
    cardNo:"3700012386804900",
    balance:10000,
    school:{id:2, name:"St. Agnes Primary School"}
},
]

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

export default function DashboardScreen() {
  
  return (
    <LinearGradient
      colors={['#008080','#00AEAE', '#00DCDC']}
      //colors={['rgba(58, 131, 244,0.4)', 'rgba(9, 181, 211, 0.4)']}
      className="w-full flex-1"
    >
      <SafeAreaView>
        <View className="container">
          <View className="flex-row mt-5 justify-between items-center px-4">
            <Bars3CenterLeft color={storeColors.yellow} />
            <Bell color={storeColors.yellow} />
          </View>
           
          {/* schools */}
          <View className="space-y-4 mt-10">
            <SchoolsList schools={schools}/>
          </View>

          {/* cards row  */}
          <Beneficiaries beneficiaries={cards}/>

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
      </SafeAreaView>   

    </LinearGradient>
      
  )
}