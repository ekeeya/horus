import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, thunkAPI) => {
    try {
      const response = await client.get('/api/v1/students');
      console.log(response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);


export const studentSlice = createSlice({
  name: 'students',
  initialState: {
    loading: false,
    students:[],
    error:null
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudents.pending, state => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload.entries;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Authentication Failed',
          textBody: `Failed: ${action.payload}`,
        });
      })
  },
});

// export const {handleLogout, setLoading} = studentSlice.actions;

export default studentSlice.reducer;
