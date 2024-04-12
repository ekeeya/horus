import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { renderDateTime, formatCreditCardNumber } from "../utils"
import GradientButton from './GradientButton'
import { storeColors } from '../theme';

const {width, height} = Dimensions.get("window")
export default function Transactions({ transactions, hclass }) {
    return (
        <ScrollView style={{height:height/2.5}} className={hclass && hclass} showsVerticalScrollIndicator={false}>
            {
                transactions.map((transaction, index) => {
                    let bg = "rgba(255,255,255,0.4)";
                    let image = require('../assets/images/success.png');
                    let color = "#0F9D58"
                    switch (transaction.status.toLocaleLowerCase()) {
                        case "failed":
                            image = require('../assets/images/failed.png');
                            color = "#DB4437"
                            break;
                        case "pending":
                            image = require('../assets/images/pending.png');
                            color = "#4285F4"
                            break;
                        default:
                            break;
                    }
                    return (
                        <TouchableOpacity
                            className="mx-4 p-2 mb-2 flex-row rounded-3xl bg-cloud"
                            key={index}>
                            <Image source={image} style={{ width: 50, height: 50 }}
                                className="rounded-2xl" />
                            <View className="flex-1 flex justify-center pl-3 space-y-3">
                                <View className="flex-row space-x-3">
                                    <Text
                                     style={{ color: storeColors.text }}
                                        className="font-bold">
                                        TOP-UP
                                    </Text>
                                    <Text className="font-bold" style={{ color: storeColors.text }}>
                                        {formatCreditCardNumber(transaction.cardNo)}
                                    </Text>
                                </View>
                                <View className="flex-row space-x-3">
                                    <View className="flex-row justify-between space-x-10">

                                        <Text style={{ color: color }} className="text-xs font-extrabold">
                                            {transaction.status}
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row space-x-3">
                                    <View className="flex-row justify-between space-x-10">

                                        <Text style={{ color: storeColors.text }} className="text-xs">
                                            {renderDateTime(transaction.createdAt)}
                                        </Text>
                                        <Text style={{ color: storeColors.text }} className="text-xs font-bold">
                                            {transaction.amount.toLocaleString()}/=
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="flex justify-center items-center">
                                <GradientButton value="View" buttonClass="py-2 px-5" />
                            </View>
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    )
}