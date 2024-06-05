import {View, Text, ScrollView, Dimensions} from 'react-native';
import React, { useEffect } from "react";
import {renderDateTime} from '../utils';
import DynamicIcon from './DynamicIcon';
import colors from 'tailwindcss/colors';

const {width, height} = Dimensions.get('window');

export default function Transactions({transactions, hclass}) {

  useEffect(() => {
    console.log(width, height)
  }, []);
  return (
    <ScrollView
      style={{height: height / 2.5}}
      className={hclass && hclass}
      showsVerticalScrollIndicator={false}>
      {transactions.map((transaction, index) => {
        let tName = 'PURCHASE';
        let bcColor = '#ffcecd';
        let sign = '-';
        let iconColor = colors.red['500'];
        let icon = 'arrow-up-right';
        if (transaction.transactionType === 'COLLECTION') {
          bcColor = '#dde1fa';
          sign = '+';
          iconColor = colors.blue['600'];
          tName = 'DEPOSIT';
          icon = 'arrow-down-left';
        }
        let color = 'text-green-600';
        switch (transaction.status.toLocaleLowerCase()) {
          case 'failed':
            color = 'text-red-600';
            break;
          case 'pending':
            color = 'text-orange-400';
            break;
          default:
            break;
        }
        return (
          <View
            key={index}
            className={
              `flex flex-row justify-between mt-4 border rounded-lg  border-blue-200 items-center ${width < 370 ? 'p-1' :'p-2'} w-auto`
            }>
            <View className={`flex flex-row items-center justify-start ${width < 370 ? 'space-x-0' :'space-x-2'} `}>
              <View
                style={{backgroundColor: bcColor}}
                className="h-10 w-10 rounded-full justify-center items-center">
                <DynamicIcon
                  name={icon}
                  size={20}
                  provider="Feather"
                  color={iconColor}
                />
              </View>
              <View className="mx-2">
                <View>
                  <Text
                    style={width < 330 ? {fontSize: 10} : {}}
                    className={`${width<370 && 'text-xs' } font-bold text-blue-800`}>
                    {tName} -{' '}
                    {transaction.receiver
                      ? transaction.receiver.fullName
                      : transaction.debitAccount.name}
                  </Text>
                </View>
                {transaction.transactionType !== 'COLLECTION' &&
                transaction.msisdn ? (
                  <Text
                    style={width < 330 ? {fontSize: 10} : {}}
                    className="text-xs mx-1 text-gray-500">
                    From: {transaction.msisdn}
                  </Text>
                ) : (
                  <Text
                    style={width < 330 ? {fontSize: 10} : {}}
                    className="text-xs mx-1 text-gray-500">From: Bursary</Text>)
                }
                <Text
                  style={width < 330 ? {fontSize: 10} : {}}
                  className="font-bold text-xs text-gray-500">
                  {renderDateTime(transaction.createdAt)}
                </Text>
              </View>
            </View>
            <View className="flex items-end">
              <Text className={`${color} font-bold text-xs`}>
                {transaction.status}
              </Text>
              <Text
                style={width < 330 ? {fontSize: 8} : {}}
                className={`text-xs ${
                  sign === '+' ? 'text-blue-800' : 'text-red-500'
                } font-bold`}>
                {sign} UGX {transaction.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
