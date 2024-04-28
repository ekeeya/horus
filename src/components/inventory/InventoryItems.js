import {ScrollView} from 'react-native';
import InventoryItem from './InventoryItem';
import React from 'react';

const InventoryItems = ({items, handleOnClick}) => {
  return (
    <ScrollView className="h-auto" showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <InventoryItem onClicked={handleOnClick} key={index} item={item} />
      ))}
    </ScrollView>
  );
};
export default InventoryItems;
