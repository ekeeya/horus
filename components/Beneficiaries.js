import React from 'react';
import {View, Text, ScrollView} from 'react-native';
import WalletCard from './WalletCard';
import {storeColors} from '../theme';

export default function Beneficiaries({beneficiaries, onCreateClicked}) {
  const listenToCreateClicked = () => {
    onCreateClicked();
  };
  return (
    <View className="mt-1 space-y-5">
      <View className="pl-2">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {beneficiaries.map((item, index) => {
            return (
              <WalletCard
                createClicked={listenToCreateClicked}
                count={beneficiaries.length}
                key={index}
                item={item}
                idx={index}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
