import React, {useEffect, useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import GradientButton from './GradientButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import {storeColors} from '../theme';
import colors from 'tailwindcss/colors';
import DynamicIcon from './DynamicIcon';

export default function ActionsList({action, isContributor, onPress}) {
  const [activeAction, setActiveAction] = useState();
  const [actions, setActions] = useState([]);
  const [contributorActions, setContributorActions] = useState([
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
    {
      name: 'suspend',
      icon: 'book-cancel-outline',
      iconProvider: 'MaterialCommunityIcons',
      label: 'Suspend',
    },
  ]);
  const [nonContributorActions, setNonContributorActions] = useState([
    {
      name: 'link',
      icon: 'link',
      label: 'Contribute',
    },
  ]);
  const handleSelectedAction = value => {
    setActiveAction(value);
    onPress(value);
  };
  useEffect(() => {
    if (isContributor) {
      setActions(contributorActions);
    } else {
      setActions(nonContributorActions);
    }
  }, [isContributor]);
  return (
    <View className="pl-2">
      <View className={'flex flex-row justify-between mx-4 p-1'}>
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
