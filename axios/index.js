import axios from 'axios';

// const domain = 'https://sobola.org';
const domain = 'http://192.168.1.116:8000';

const prefix = '/';

const TIME_OUT = 100000;
const ROOT_URL = `${domain}${prefix}`;
export const FORM_DATA_HEADER = {'Content-Type': 'multipart/form-data'};
export const JSON_DATA_HEADER = {'Content-Type': 'application/json'};

const client = axios.create({});

import {store} from '../store/store';

client.interceptors.request.use(
  config => {
    // ** Get token from localStorage
    const {url} = config;
    const exemptLink = ['/login'];
    if (url === '/api/v1/users/tokens/refresh') {
      const refreshToken = store.getState().auth.refreshToken;
      config.headers.Authorization = `Bearer ${refreshToken.token}`;
    } else {
      const accessToken = store.getState().auth.accessToken;
      if (!exemptLink.includes(url)) {
        config.headers.Authorization = `Bearer ${accessToken.token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error),
);

client.defaults.timeout = TIME_OUT;
client.defaults.baseURL = ROOT_URL;
export default client;


