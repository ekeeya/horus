import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {generateError} from '../utils';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';
import {Order} from '../models/inventory.tsx';

export const getCard = createAsyncThunk(
  'payment/getCard',
  async (cardNo, thunkAPI) => {
    try {
      const response = await client.get(`/api/v1/wallet/account/${cardNo}`);
      return response.data.data;
    } catch (error) {
      const errorMsg = generateError(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const getTransactions = createAsyncThunk(
  'payment/getTransactions',
  async (id, thunkAPI) => {
    try {
      const response = await client.get(`/api/v1/transactions?attendant=${id}`);
      return response.data.entries;
    } catch (error) {
      const errorMsg = generateError(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);
export const makePayment = createAsyncThunk(
  'payment/makePayment',
  async (order, thunkAPI) => {
    try {
      const response = await client.post('/api/v1/wallet/make-payment', order);
      return response.data.data;
    } catch (error) {
      const errorMsg = generateError(error);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

export const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    processing: false,
    paying: false,
    paid: false,
    loading: false,
    paymentAmount: 0,
    payments: [],
    cardDetails: {},
    error: null,
  },
  reducers: {
    setPaid: (state, action) => {
      state.paid = action.payload;
    },
    setPaymentAmount: (state, action) => {
      state.paymentAmount = action.payload;
    },
    resetCardDetails: state => {
      state.cardDetails = {};
    },
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getCard.pending, state => {
        state.processing = true;
      })
      .addCase(getCard.fulfilled, (state, action) => {
        state.processing = false;
        state.cardDetails = action.payload;
      })
      .addCase(getCard.rejected, (state, action) => {
        state.processing = false;
        state.error = action.payload;
        state.paid = true;
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failure',
          textBody: `Failed to validate this card. ${action.payload}`,
          button: 'Dismiss',
          autoClose: 7000,
        });
      })
      .addCase(makePayment.pending, state => {
        state.paying = true;
      })
      .addCase(makePayment.fulfilled, (state, action) => {
        state.paying = false;
        state.cardDetails = action.payload;
        state.paid = true;
        // Update inventory

        Dialog.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Success',
          textBody: 'Congrats! Payment was successful',
          button: 'Dismiss',
          autoClose: true,
        });
      })
      .addCase(makePayment.rejected, (state, action) => {
        state.paying = false;
        state.paid = true; // don't worry I know what I am doing
        state.error = action.payload;
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failure',
          textBody: `Payment Failed: ${action.payload}`,
          button: 'Dismiss',
          autoClose: 7000,
        });
      })
      .addCase(getTransactions.pending, state => {
        state.loading = true;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
export const {resetCardDetails, setPaymentAmount, setPaid, resetError} =
  paymentSlice.actions;
export default paymentSlice.reducer;
