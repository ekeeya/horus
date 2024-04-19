import { 
    View, 
    TouchableOpacity,
    Image,
    Text 
} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

export default function StudentSearchResult({ student }) {

    const navigation =  useNavigation();

    const goToWalletScreen = () => {
        navigation.navigate('Wallet', { student: student });
      };
    return (
        <TouchableOpacity 
            onPress={() => goToWalletScreen()}
            className="bg-blue mt-3 w-full h-16 justify-center rounded-3xl">
            <View className="flex flex-row justify-between">
                <View className="flex flex-row items-center">
                    <Image source={require("../assets/images/student.png")}
                        className="img w-10 h-10 mx-3 " />
                    <View >
                        <Text className="justify-center text-white font-bold">{student.fullName}</Text>
                        <Text className="text-white">{student.school.name}</Text>
                    </View>
                </View>
                <View className="flex mr-5 justify-center">
                    <Text className="font-bold text-white">{student.className}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}