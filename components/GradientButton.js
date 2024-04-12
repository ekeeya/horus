import {Text, TouchableOpacity } from 'react-native'
import React from 'react'
import {storeColors} from '../theme';
import { LinearGradient } from 'react-native-linear-gradient'

export default function GradientButton(props) {
  return (
    <LinearGradient
        colors={['#407df9', '#2b68f5']}
        end={{x:1, y:1}}
        start={{x: 0.1, y: 0.2}}
        className={`rounded-full ${props.containerClass}`}
    >
        <TouchableOpacity className={`p-3 px-4 ${props.buttonClass}`}>
            <Text  style={{color: storeColors.white}} className="font-bold">
                {props.value}
            </Text>
        </TouchableOpacity>
    </LinearGradient>
  )
}