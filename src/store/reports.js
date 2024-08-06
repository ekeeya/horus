import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {generateError} from '../utils';
import {ALERT_TYPE, Dialog} from 'react-native-alert-notification';

const downloadExcelFile = (data, fileName) => {
  const blob = new Blob([data], {type: 'application/octet-stream'}); // Set correct MIME type for .xlsx files
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getSalesSummaryReport = createAsyncThunk(
  'appInventory/getSalesSummaryReport',
  async (params, thunkAPI) => {
    const options = 'format' in params ? {responseType: 'blob'} : {};
    const posId = params.posId;
    delete params.posId;
    const url = `/api/v1/inventory/daily-sales-summary/${posId}`;
    const response = await client.get(url, {params, ...options});

    if ('format' in params) {
      const fileName = `daily-sales-summary-report-${new Date().getTime()}.xlsx`;
      downloadExcelFile(response.data, fileName);
    } else {
      return response.data;
    }
  },
);

export const reportsSlice = createSlice({
  name: 'payment',
  initialState: {
    working: false,
    dailySummaryEntries: [],
    totals: 0,
    error: null,
  },
  reducers: {
    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getSalesSummaryReport.pending, state => {
        state.working = true;
      })
      .addCase(getSalesSummaryReport.fulfilled, (state, action) => {
        state.working = false;
        if(action.payload){
          state.dailySummaryEntries = action.payload;
          state.totals= action.payload.reduce((sum, current) => sum + current.totalAmountSold, 0)
        }
      })
      .addCase(getSalesSummaryReport.rejected, (state, action) => {
        state.working = false;
        state.error = action.payload;
        state.paid = true;
        Dialog.show({
          type: ALERT_TYPE.DANGER,
          title: 'Failure',
          textBody: `Failed to validate this card. ${action.payload}`,
          button: 'Dismiss',
          autoClose: 7000,
        });
      });
  },
});
export const {resetError} = reportsSlice.actions;
export default reportsSlice.reducer;
