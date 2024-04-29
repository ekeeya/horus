import {ScrollView} from 'react-native';
import React from 'react';
import LongOrderItem from './LongOrderItem';

const InventoryItems = ({items, handleOnClick}) => {
  return (
    <ScrollView className="h-2/3" showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <LongOrderItem onClicked={handleOnClick} key={index} item={item} />
      ))}
    </ScrollView>
  );
};
export default InventoryItems;
