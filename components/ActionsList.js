import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import GradientButton from './GradientButton'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { storeColors } from '../theme';

export default function ActionsList({action, onPress}) {
    const [activeAction, setActiveAction] = useState();
    const [actions, setActions] = useState([
        {
            name: "topup",
            icon: "add-card",
            label: "Top Up"
        },
       /*  {
            name: "edit",
            icon: "edit",
            label: "Set Limit"
        } */
]);
    const handleSelectedAction = (value)=>{
        setActiveAction(value);
        onPress(value)
    }
    useEffect (()=>{
            console.log(action)
    },[action])
    return (
        <View className="pl-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                    actions.map((action, idx) => {
                        return (
                            <View key={idx} className="h-20 mx-8 items-center">
                                <TouchableOpacity
                                    style={{elevation:10}}
                                    onPress={() => handleSelectedAction(action.name)}
                                    key={idx}
                                    className={`${action.name === activeAction ? 'bg-blue text-white' :'bg-blue'} h-20 w-20  items-center justify-center rounded-full`}>
                                    <MaterialIcons name={action.icon} size={35} color={action.name===activeAction ? storeColors.white : storeColors.white} />
                                </TouchableOpacity>
                                <Text className="mt-1 text-center font-semibold" style={{color:action.name===activeAction ? storeColors.blue : storeColors.text}}>{action.label}</Text>
                            </View>

                        )
                        
                    })
                }
            </ScrollView>
        </View>
    )
}
