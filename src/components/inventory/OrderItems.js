import {ScrollView} from 'react-native';

import React from 'react';
import OrderItem from './OrderItem';

const OrderItems = ({items, handleRemove}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item, index) => (
        <OrderItem onClicked={handleRemove} key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};
export default OrderItems;
