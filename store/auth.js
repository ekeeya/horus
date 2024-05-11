import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getData, removeItem, storeData} from '../utils';
import client, {FORM_DATA_HEADER} from '../axios';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

export const login = createAsyncThunk(
  'access/login',
  async (credentials, thunkAPI) => {
    try {
      const headers = FORM_DATA_HEADER;
      const response = await client.post('/login', credentials, {headers});
      const user = response.data;
      if (user.user.accountType !== 'PARENT') {
        return thunkAPI.rejectWithValue('Authentication Failed');
      }
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: 'Congrats',
        textBody: 'Authentication was successful!',
      });
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);
export const refreshTokens = createAsyncThunk(
  'access/refreshToken',
  async (data, thunkAPI) => {
    try {
      const response = await axios.get();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const initialUser = async () => {
  const item = await getData('userData');
  return item;
};

export const isLoggedIn = async () => {
  const user = await initialUser();
  console.log(user);
  return user !== null;
};
export const initialAccessToken = async () => {
  const accessToken = await getData('accessToken');
  return accessToken ? accessToken : null;
};

export const initialRefreshToken = async () => {
  const refreshToken = await getData('refreshToken');
  return refreshToken ? refreshToken : null;
};

export const accessSlice = createSlice({
  name: 'access',
  initialState: {
    loading: false,
    authenticating: false,
    userData: null,
    accessToken: {},
    refreshToken: {},
    loginError: null,
    isLoggedIn: false,
  },
  reducers: {
    initializeAuthStore: (state, action) => {
      const user = action.payload.user;
      const accessToken = action.payload.access_token;
      const refreshToken = action.payload.refresh_token;
      state.userData = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoggedIn = user !== null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    handleLogout: state => {
      state.userData = null;
      state.isLoggedIn = false;
      // ** Remove user, accessToken & refreshToken from localStorage
      removeItem('userData');
      removeItem('accessToken');
      removeItem('refreshToken');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.authenticating = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authenticating = false;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.userData = action.payload;
        state.isLoggedIn = true;
        storeData('userData', action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.authenticating = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: `Failed: ${action.payload}`,
        });
      })
      .addCase(refreshTokens.fulfilled, (state, action) => {
        console.log(action.payload);
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(refreshTokens.rejected, (state, action) => {
        console.log('Log you out');
      });
  },
});

export const {handleLogout, setLoading, initializeAuthStore} =
  accessSlice.actions;

export default accessSlice.reducer;
