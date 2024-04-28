import {ScrollView, View} from 'react-native';

import React from 'react';
import OrderItem from './OrderItem';

const OrderItems = ({items, handleRemove}) => {
  return (
    <View className="xw-full">
      <ScrollView
        className="h-auto w-auto"
        horizontal
        showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <OrderItem onClicked={handleRemove} key={index} item={item} />
        ))}
      </ScrollView>
    </View>
  );
};
export default OrderItems;
