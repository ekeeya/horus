import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment-timezone';

moment.tz.setDefault('Africa/Nairobi');
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('Store data failed', e);
  }
};

export const getData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log('could not retrieve data', e);
  }
};

export const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }

  console.log('Done.');
};

export const formatCreditCardNumber = number => {
  if (typeof number !== 'string') {
    number = number.toString();
  }
  number = number.replace(/\D/g, '');
  const formatPattern = /(\d{4})(?=\d)/g;
  return number.replace(formatPattern, '$1 ');
};

export const generateError = error => {
  let errorMsg = 'Failed';
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let msg = error.response.data.message
      ? error.response.data.message
      : error.response.data.error
      ? error.response.data.error
      : error.response.data.detail
      ? error.response.data.detail
      : error.response.data;
    errorMsg = `${msg}`;
  } else {
    // Something happened in setting up the request that triggered an Error
    errorMsg = `${error.message}`;
  }
  return errorMsg;
};

export const cleanTag = value => {
  return value.replace('https://www.en', '');
};
export const renderDateTime = date => {
  const m = moment(date);
  return m.format('hh:mmA | DD.MM.YYYY');
};
