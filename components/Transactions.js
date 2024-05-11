import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import React from 'react';
import { formatCreditCardNumber, renderDateTime } from "../utils";
import DynamicIcon from './DynamicIcon';
import colors from 'tailwindcss/colors';

const {width, height} = Dimensions.get('window');
export default function Transactions({transactions, hclass}) {
  return (
    <ScrollView
      style={{height: height / 2.5}}
      className={hclass && hclass}
      showsVerticalScrollIndicator={false}>
      {transactions.map((transaction, index) => {
        let cardNo = transaction.cardNo;
        let tName = transaction.orderName;
        let bcColor = '#ffcecd';
        let iconColor = colors.red['500'];
        let icon = 'upload';
        if (transaction.transactionType === 'COLLECTION') {
          bcColor = '#dde1fa';
          iconColor = colors.blue['600'];
          tName = 'DEPOSIT';
          icon = 'download';
          cardNo = transaction.creditAccount.cardNo;
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
          <View className="flex flex-row justify-between mt-2 items-center">
            <View className="flex flex-row items-center justify-start space-x-2">
              <View
                style={{backgroundColor: bcColor}}
                className="h-14 w-14 rounded-full justify-center items-center">
                <DynamicIcon
                  name={icon}
                  size={25}
                  provider="Feather"
                  color={iconColor}
                />
              </View>
              <View className="mx-2">
                <View>
                  <Text className="font-bold text-blue-800">
                    {tName} - {formatCreditCardNumber(cardNo)}
                  </Text>
                </View>
                <Text className="font-bold text-gray-500">
                  {renderDateTime(transaction.createdAt)}
                </Text>
              </View>
            </View>
            <View className="flex items-end">
              <Text className={`${color} font-bold`}>{transaction.status}</Text>
              <Text className="font-bold text-red-500">
                -UGX {transaction.amount.toLocaleString()}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
