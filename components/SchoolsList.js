import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import GradientButton from './GradientButton'

import { storeColors } from '../theme';
import { useDispatch } from 'react-redux';
import { setSelectedSchool } from '../store/students';

export default function SchoolsList({ schools }) {
    const [activeSchool, setActiveSchool] = useState({ id: 0, name: "All" });

    const dispatch =  useDispatch();

    const handleSelectedSchool = (school)=>{
            setActiveSchool(school);
            dispatch(setSelectedSchool(school))
    }
    return (
        <View className="pl-2">
            <Text
                  style={{color: storeColors.text}}
                  className="ml-2 mb-2  underline text-lg font-bold">
                   Schools
              </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}>
                {
                        schools.map(school => {
                            if (school.id == activeSchool.id) {
                                return (
                                    <GradientButton key={school.id} containerClass="mr-2" value={school.name} />
                                )
                            } else {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleSelectedSchool(school)}
                                        key={school.id}
                                        className="bg-cloud p-3 px-4 rounded-full mr-2">
                                        <Text style={{ color: storeColors.text }} className="font-semibold">
                                            {school.name}
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
