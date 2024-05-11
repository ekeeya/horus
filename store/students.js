import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import client from '../axios';
import {ALERT_TYPE, Toast} from 'react-native-alert-notification';
import {computeUrlParams} from '../utils';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, thunkAPI) => {
    try {
      const response = await client.get('/api/v1/students');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const searchStudent = createAsyncThunk(
  'students/searchStudent',
  async (params, thunkAPI) => {
    try {
      let url = '/api/v1/students';
      url = computeUrlParams(url, params);
      const response = await client.get(url);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const linkToStudent = createAsyncThunk(
  'students/linkToStudent',
  async (params, thunkAPI) => {
    try {
      const url = '/api/v1/request-student-link';
      const response = await client.post(url, params);
      thunkAPI.dispatch(fetchStudents({}));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const fetchSchools = createAsyncThunk(
  'students/fetchSchools',
  async (_, thunkAPI) => {
    try {
      const response = await client.get('/api/v1/schools');
      console.log(response.data);
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
    students: [],
    studentResults: [],
    selectedSchool: null,
    schools: [],
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSelectedSchool: (state, action) => {
      state.selectedSchool = action.payload;
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
        //state.students.push({id: 0, isEmpty: true});
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error:',
          textBody: `Failed: ${action.payload}`,
        });
      })
      .addCase(fetchSchools.pending, state => {
        state.loading = true;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.schools = action.payload.entries;
        state.schools.unshift({id: 0, name: 'All'});
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchStudent.pending, state => {
        state.loading = true;
      })
      .addCase(searchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.studentResults = action.payload.entries;
      })
      .addCase(searchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error:',
          textBody: `Failed: ${action.payload}`,
        });
      })
      .addCase(linkToStudent.pending, state => {
        state.loading = true;
      })
      .addCase(linkToStudent.fulfilled, (state, action) => {
        const {status} = action.payload.data;
        state.loading = false;
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: 'Link Request succeded',
          textBody:
            status === 'PENDING'
              ? 'Wait for Primary parent to approve your request in order  to start contributing'
              : 'You can now start contributing to this wallet',
        });
      })
      .addCase(linkToStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: 'Error:',
          textBody: `Failed: ${action.payload}`,
        });
      });
  },
});

export const {setSelectedSchool} = studentSlice.actions;

export default studentSlice.reducer;
