import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert} from 'react-native';

import {storeColors} from '../theme';
import colors from 'tailwindcss/colors';
import DynamicIcon from './DynamicIcon';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTransactions} from '../store/transactions';
import {setShowTopUp} from '../store/wallet';

export default function ActionsList({action, student, onPress}) {
  const [activeAction, setActiveAction] = useState();
  const [actions, setActions] = useState([
    {
      name: 'edit',
      icon: 'edit',
      iconProvider: 'MaterialIcons',
      label: 'Set Limit',
    },
    {
      name: 'topup',
      icon: 'add-card',
      iconProvider: 'MaterialIcons',
      label: 'Top Up',
    },
    /*{
      name: 'suspend',
      icon: 'book-cancel-outline',
      iconProvider: 'MaterialCommunityIcons',
      label: 'Suspend',
    },*/
  ]);

  const dispatch = useDispatch();
  const handleSelectedAction = value => {
    setActiveAction(value);
    //onPress(value);
    if (value === 'topup') {
      dispatch(setShowTopUp(true));
    }
  };

  return (
    <View className="pl-2">
      <View className={'flex flex-row justify-evenly mx-4 p-1'}>
        {actions.map((action, idx) => {
          return (
            <View key={idx} className="h-2/4">
              <TouchableOpacity
                onPress={() => handleSelectedAction(action.name)}
                key={idx}
                style={{
                  backgroundColor:
                    action.name === activeAction
                      ? colors.blue['600']
                      : '#dde3fb',
                }}
                className={
                  'h-14 w-14  items-center justify-center rounded-full'
                }>
                <DynamicIcon
                  name={action.icon}
                  size={24}
                  provider={action.iconProvider}
                  color={
                    action.name === activeAction
                      ? colors.white
                      : colors.blue['800']
                  }
                />
              </TouchableOpacity>
              <Text
                className="mt-1 text-center font-semibold"
                style={{
                  color:
                    action.name === activeAction
                      ? storeColors.blue
                      : colors.gray['500'],
                }}>
                {action.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
