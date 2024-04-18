import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import { computeUrlParams } from '../utils';

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async (params, thunkAPI) => {
    try {
      let url = "/api/v1/transactions"
      url = computeUrlParams(url, params)
      const response = await client.get(url);
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);



export const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    fetching: false,
    transactions:[],
    error:null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    updateTransactions:(state, action)=>{
        state.transactions =  state.transactions.unshift(action.payload)
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTransactions.pending, state => {
        state.fetching = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.fetching = false;
        state.transactions = action.payload.entries;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.fetching = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: `Failed: ${action.payload}`,
        });
      })
  },
});

export const {updateTransactions, setLoading} = transactionSlice.actions;

export default transactionSlice.reducer;
