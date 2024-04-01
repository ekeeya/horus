import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import GradientButton from './GradientButton'

import {storeColors} from '../theme';

export default function SchoolsList({ schools }) {
    const [activeSchool, setActiveSchool] = useState('All');

    return (
        <View className="pl-2">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                    schools.map(school => {
                        if (school == activeSchool) {
                            return (
                                <GradientButton key={school} containerClass="mr-2" value={school} />
                            )
                        } else {
                            return (
                                <TouchableOpacity
                                    onPress={() => setActiveSchool(school)}
                                    key={school}
                                    className="bg-teal p-3 px-4 rounded-full mr-2">
                                    <Text style={{color: storeColors.white}} className="font-semibold">
                                        {school}
                                    </Text>
                                </TouchableOpacity>

                            )
                        }

                    })
                }
            </ScrollView>
        </View>
    )
}
