import React, {useState, useEffect} from "react";
import {
  View, 
  Text,
  Image, 
  ActivityIndicator,
  StyleSheet 
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, TextInput } from 'react-native-paper';
import {storeColors} from '../theme';
import { User } from "@nandorojo/heroicons/24/outline";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import { login} from '../store/auth';

const LoginScreen =()=>{

  const navigation = useNavigation();

  const [username, setUsername] = useState('756315405');
  const [secureText, setSecureText] = useState(true);
  const [password, setPassword] = useState('756315405');

  // dispatch
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
    isLoggedIn && navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboad' }],
      }); 
  }, [isLoggedIn]);

    return (
        <KeyboardAwareScrollView className="flex h-screen mx-5 p-2">
            <View className="items-center mt-10">
              <Text className="mb-3 text-2xl font-bold" color={{color:storeColors.text}}>Hi Parent!</Text>
              <Text>Login to actively monitor your child's wallet.</Text>
              <View className="items-center justify-items-center">
                  <Image
                    source={require("../assets/logos/logo.png")}
                    className="img w-28 h-28 mt-5 mb-10"
                  />
              </View>
            </View>
            <View className="mt-40 mb-3">
            
              <TextInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  mode="outlined"
                  right={<TextInput.Icon name={() => (<User color={"black"} size={20}/>)} />}
                    />

                <TextInput
                  className="mt-10"
                  onChangeText={setPassword}
                  value={password}
                  mode="outlined"
                  label="Password"
                  secureTextEntry
                    />
              </View>
              <View className="content-center mt-10">
                  <Button
                    onPress={handleLogin}
                    className="bg-red h-12 justify-center"
                    >
                      {authenticating ? (
                          <ActivityIndicator
                            style={styles.spinner}
                            size="small"
                            color="#ffff"
                          />
                        )
                        :
                        <Text className="text-xl text-white font-extrabold">Sign In</Text>
                        }
                    
                  </Button>
              </View>
            
        </KeyboardAwareScrollView>
      )
}

const styles = StyleSheet.create({
  spinner: {
    marginHorizontal: 20,
  },
});
export default LoginScreen;