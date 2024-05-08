import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../components/Input';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {initialUser, login} from '../store/auth';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
const {width, height} = Dimensions.get('window');
import {horizontalScale, moderateScale, verticalScale} from '../utils/Metrics';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const Login = () => {
  const [username, setUsername] = useState('parvin');
  const [secureText, setSecureText] = useState(true);
  const [password, setPassword] = useState('12345678');

  // dispatch
  const dispatch = useDispatch();
  // store
  const {authenticating, loginError, isLoggedIn} = useSelector(
    store => store.auth,
  );

  const navigation = useNavigation();
  const ToggleSeePassword = () => {
    return (
      <TouchableOpacity onPress={() => setSecureText(!secureText)}>
        {secureText ? (
          <Entypo name="eye" size={20} color="#167D7F" style={styles.icon} />
        ) : (
          <Entypo
            name="eye-with-line"
            size={20}
            color="#167D7F"
            style={styles.icon}
          />
        )}
      </TouchableOpacity>
    );
  };

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
      console.log(credentials);
      dispatch(login(credentials));
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const result = await initialUser();
      } catch (error) {
        // Handle errors
      }
    })();
  }, []);

  useEffect(() => {
    isLoggedIn && navigation.navigate('Home');
  }, [isLoggedIn]);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView style={styles.innerContainer}>
        <View style={styles.headerDash} />
        <View style={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTextTitle}>Welcome Back!</Text>
            <Text style={styles.welcomeTextSubTitle}>
              Let's login and begin duty!
            </Text>
          </View>
          <View style={styles.logoContainer}>
            <View style={styles.border} />
            <Image
              source={require('../assests/logo2.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.formSignin}>
            <Input
              onChangeText={setUsername}
              value={username}
              label="Username"
              leftIcon={
                <Ionicons
                  name="keypad"
                  size={20}
                  color="#167D7F"
                  style={styles.icon}
                />
              }
              rightIcon={
                username.length > 0 && (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={20}
                    color="#167D7F"
                    style={styles.icon}
                  />
                )
              }
              placeholder="Enter your username"
            />
            <Input
              onChangeText={setPassword}
              value={password}
              label="Password"
              notice="If you forget your password, consult the system admin at your school"
              secureTextEntry={secureText}
              leftIcon={
                <Fontisto
                  name="locked"
                  size={20}
                  color="#167D7F"
                  style={styles.icon}
                />
              }
              rightIcon={<ToggleSeePassword />}
              placeholder="Enter your password"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              {authenticating && (
                <ActivityIndicator
                  style={styles.spinner}
                  size="small"
                  color="#167D7F"
                />
              )}
              <Text style={styles.loginButtonText}>Sign in</Text>
            </TouchableOpacity>

            <View style={styles.noticeContainer}>
              <Text style={styles.notice}>
                This login screen is only for Point Of Sale (POS) attendants.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#167D7F',
    position: 'relative',
  },
  innerContainer: {
    backgroundColor: '#f5f8ff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
  },
  headerDash: {
    borderWidth: 1.2,
    backgroundColor: '#167D7F',
    borderColor: '#167D7F',
    width: horizontalScale(width / 15),
    alignSelf: 'center',
    marginVertical: verticalScale(10),
  },
  contentContainer: {
    flex: 2,
    borderTopLeftRadius: moderateScale(30),
    borderTopRightRadius: moderateScale(30),
  },
  welcomeContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(20),
    width: '70%',
  },
  welcomeTextTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  welcomeTextSubTitle: {
    marginVertical: verticalScale(5),
    textAlign: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#eceff9',
  },
  logoImage: {
    height: verticalScale(80),
    width: horizontalScale(80),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eaf2f8', // Light blue input area
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eaf2f8', // Border same color as input area background
    paddingHorizontal: horizontalScale(12),
    marginVertical: verticalScale(8),
  },
  focusedBorder: {
    borderColor: '#167D7F', // Borders turn blue on focus
  },
  icon: {
    marginHorizontal: horizontalScale(8),
  },
  input: {
    flex: 1,
    color: 'black',
    paddingVertical: verticalScale(10),
    fontSize: moderateScale(16),
  },
  formSignin: {
    margin: moderateScale(30),
  },
  labelText: {
    fontWeight: '500',
  },
  loginButton: {
    marginVertical: verticalScale(30),
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#167D7F',
    justifyContent: 'center',
    alignItems: 'center',
    height: verticalScale(width / 8),
    borderRadius: 10,
    flexDirection: 'row',
  },
  loginButtonText: {
    fontWeight: 'bold',
    color: '#167D7F',
  },
  noticeContainer: {
    alignItems: 'center',
  },
  notice: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  spinner: {
    marginHorizontal: horizontalScale(12),
  },
});
export default Login;