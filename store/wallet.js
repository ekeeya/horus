import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {fetchTransactions} from './transactions';

export const depositWallet = createAsyncThunk(
  'wallet/depositWallet',
  async (params, thunkAPI) => {
    try {
      let url = '/api/v1/wallet/deposit';
      const response = await client.post(url, params);
      // thunkAPI.dispatch(fetchTransactions({}))
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    submitting: false,
    message: null,
    showTopUp: false,
    amount: 0,
    msisdn: '',
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setShowTopUp: (state, action) => {
      state.showTopUp = action.payload;
    },
    setData: (state, action) => {
      const {amount, msisdn} = action.payload;
      state.amount = amount;
      state.msisdn = msisdn;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(depositWallet.pending, state => {
        state.submitting = true;
      })
      .addCase(depositWallet.fulfilled, (state, action) => {
        state.submitting = false;
        state.message = action.payload.message;
        state.amount = 0;
        state.msisdn = '';
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Transaction Initiated',
          textBody: `${action.payload.message}`,
        });
      })
      .addCase(depositWallet.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload;
        state.amount = 0;
        state.msisdn = '';
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: `Failed: ${action.payload}`,
        });
      });
  },
});

export const {setData, setShowTopUp, setLoading} = walletSlice.actions;

export default walletSlice.reducer;
