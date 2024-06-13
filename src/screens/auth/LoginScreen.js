import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import colors from 'tailwindcss/colors';
import DynamicIcon from '../../components/DynamicIcon';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../../store/auth';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
const {width, height} = Dimensions.get('screen');
const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  // store
  const {authenticating, loginError, isLoggedIn} = useSelector(
    store => store.auth,
  );

  const handleLogin = () => {
    if (username.length < 1 || password.length < 1) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: 'Missing Fields',
        textBody: 'Ensure username and password are provided',
      });
    } else {
      // send login request
      const credentials = {username, password};
      dispatch(login(credentials));
    }
  };

  useEffect(() => {
    isLoggedIn &&
      navigation.reset({
        index: 0,
        routes: [{name: 'Dashboard'}],
      });
  }, [isLoggedIn, navigation]);

  return (
    <>
      <KeyboardAwareScrollView className="h-full bg-white">
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View className="flex flex-row p-2 justify-between">
          <View className="mx-5 max-h-10 border-b-2 border-black">
            <Text className="text-black font-semibold">Login</Text>
          </View>
          <View
            className={`${
              height < 700 ? 'h-20 w-20' : 'h-36 w-36'
            } rounded-full justify-center items-center`}
            style={{backgroundColor: '#f4f4f4', elevation: -2}}
          >
            <Image
              className={`${height < 700 ? 'h-14 w-14' : 'h-24 w-24'}`}
              alt="logo"
              resizeMode="center"
              source={require('../../assets/logos/logo.png')}
            />
          </View>
        </View>
        <View className={`${height < 700 ? 'mt-0' : 'mt-20'} p-5`}>
          <Text className="text-purple-900 text-4xl font-light">
            Pocket Pay PoS,
          </Text>
          <Text className="mt-2 text-purple-900 text-lg font-thin">
            Use your credentials to login and start serving!
          </Text>

          <View className="mt-10">
            <View className="mt-2">
              <TextInput
                label="Username"
                mode="focused"
                value={username}
                onChangeText={setUsername}
                contentStyle={{backgroundColor: colors.white}}
                underlineColor={colors.purple['600']}
                selectionColor={colors.purple['800']}
                outlineColor={colors.white}
                activeUnderlineColor={colors.purple['600']}
              />
              <TextInput
                className="mt-5"
                label="Password"
                mode="focused"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                contentStyle={{backgroundColor: colors.white}}
                underlineColor={colors.purple['600']}
                selectionColor={colors.purple['800']}
                outlineColor={colors.white}
                activeUnderlineColor={colors.purple['600']}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleLogin()}
              className="flex flex-row justify-center space-x-5 items-center border border-purple-800 h-16 py-3 px-6 mt-10">
              <Text className="text-purple-800 font-bold text-2xl">Login</Text>
              {authenticating ? (
                <ActivityIndicator size="small" color={colors.purple['600']} />
              ) : (
                <DynamicIcon
                  name="arrow-right-alt"
                  size={22}
                  provider="MaterialIcons"
                  color={colors.purple['800']}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default LoginScreen;
