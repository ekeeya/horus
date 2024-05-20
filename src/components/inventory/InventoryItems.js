import {ScrollView} from 'react-native';
import InventoryItem from './InventoryItem';
import React from 'react';
const InventoryItems = ({items, handleOnClick}) => {
  return (
    <ScrollView className="h-2/3" showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <InventoryItem onClicked={handleOnClick} key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};
export default InventoryItems;
