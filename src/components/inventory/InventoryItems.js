import {ScrollView} from 'react-native';
import InventoryItem from './InventoryItem';
import React from 'react';

const InventoryItems = ({items}) => {
  return (
    <ScrollView className="h-auto" showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <InventoryItem key={index} item={item} />
      ))}
    </ScrollView>
  );
};
export default InventoryItems;
