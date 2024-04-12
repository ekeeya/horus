import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import WalletCard from './WalletCard';
import {storeColors} from '../theme';

export default function Beneficiaries({beneficiaries}) {


    return (
        <View className="mt-3 space-y-5">
            <Text
                style={{ color: storeColors.blue }}
                className="ml-4 underline text-lg font-bold">
                Your Beneficiaries
            </Text>
            <View className="pl-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {
                        beneficiaries.map((item, index) => {
                            return (
                                <WalletCard key={index} wallet={item} idx={index} />
                            )
                        })
                    }
                </ScrollView>
            </View>
        </View>
    )
}
