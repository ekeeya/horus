import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import colors from 'tailwindcss/colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {login} from '../store/auth';
import DynamicIcon from '../components/DynamicIcon';
const {height} = Dimensions.get('screen');
const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('756315407');
  const [password, setPassword] = useState('756315407');

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
      <KeyboardAwareScrollView
        className="h-full"
        style={{backgroundColor: '#f2f5fe'}}>
        {/*<StatusBar backgroundColor="#f2f5fe" barStyle="dark-content" />*/}
        <View className="flex flex-row p-2 justify-between">
          <View className="mx-5 max-h-10 border-b-2 border-blue-700">
            <Text className="text-blue-800 font-semibold">Login</Text>
          </View>
          <View
            className={`${
              height < 700 ? 'h-20 w-20' : 'h-36 w-36'
            } rounded-full`}
            style={{backgroundColor: '#d6e7f1', elevation: -2}}
          />
        </View>
        <View className={`${height < 700 ? 'mt-0' : 'mt-20'} p-5`}>
          <Text style={{color: '#1939dc'}} className="text-4xl font-light">
            Welcome Back,
          </Text>
          <Text style={{color: '#1939dc'}} className="mt-2  text-lg font-thin">
            Use your credentials to login and contribute!
          </Text>

          <View className="mt-10">
            <View className="mt-2">
              <TextInput
                label="Username"
                mode="focused"
                value={username}
                onChangeText={setUsername}
                contentStyle={{backgroundColor: '#f2f5fe'}}
                underlineColor={colors.blue['600']}
                selectionColor={colors.blue['800']}
                outlineColor={colors.white}
                activeUnderlineColor={colors.blue['600']}
              />
              <TextInput
                className="mt-5"
                label="Password"
                mode="focused"
                onChangeText={setPassword}
                value={password}
                secureTextEntry
                contentStyle={{backgroundColor: '#f2f5fe'}}
                underlineColor={colors.blue['600']}
                selectionColor={colors.blue['800']}
                outlineColor={colors.white}
                activeUnderlineColor={colors.blue['600']}
              />
            </View>
            <TouchableOpacity
              onPress={() => handleLogin()}
              className="flex flex-row justify-center space-x-5 items-center border border-blue-700 h-16 py-3 px-6 mt-10">
              <Text
                style={{color: colors.blue['800']}}
                className="font-bold text-2xl">
                Login
              </Text>
              {authenticating ? (
                <ActivityIndicator size="small" color={colors.blue['600']} />
              ) : (
                <DynamicIcon
                  name="arrow-right-alt"
                  size={22}
                  provider="MaterialIcons"
                  color={colors.blue['800']}
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
