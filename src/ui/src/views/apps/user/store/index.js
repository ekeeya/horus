// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
// ** Axios Imports
import client from '../../../../axios';
import {generateError} from '@utils';
import toast from "react-hot-toast";

export const fetchUsers = createAsyncThunk('appUsers/fetchUsers', async (configs, thunkAPI) => {
    try {
        const {page} = configs;
        delete configs['page']
        let url = `/api/v1/users?page=${page}`
        Object.keys(configs).forEach(key => {
            if (configs[key] != null || configs[key] !== "") {
                url += `&${key}=${configs[key]}`
            }
        });
        const response = await client.get(url);
        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const getUser = createAsyncThunk('appUsers/getUser', async (id, thunkAPI) => {
    try {
        const url = `/api/v1/users/${id}`
        const response = await client.get(url)
        return response.data.data
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const getMe = createAsyncThunk('appUsers/getMe', async (id, thunkAPI) => {
    try {
        const url = `/api/v1/users/me`
        const response = await client.get(url);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error));
    }
})

export const addUser = createAsyncThunk('appUsers/addUser', async (data, thunkAPI) => {
    try {
        const response = await client.post('/api/v1/users/register', data);
        console.log(data)
        const msg = data.id ? `User info updated successfully` : `New user registered`;
        toast.success(msg, {duration: 8000, position: "top-center"})
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error));
    }
})

export const deleteUser = createAsyncThunk('appUsers/deleteUser', async (id, thunkAPI) => {
    try {
        await client.delete(`/api/v1/users/delete/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error));
    }
})

export const accountManagement = createAsyncThunk('appUsers/accountManagement', async (payload, thunkAPI) => {
    try {
        const { action, account} =  payload;
        const response = await client.get(`/api/v1/users/account-management?action=${action}&account=${account}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error));
    }
})

const errorReducer = (state, {payload}) => {
    state.loading = false;
    state.error = payload
}
export const appUsersSlice = createSlice({
    name: 'appUsers',
    initialState: {
        loading: false,
        submitted: null,
        total: 1,
        users: [],
        edit: false,
        error: null,
        selectedUser: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSubmitted: (state, {payload}) => {
            state.setSubmitted = payload;
        },
        setEditing: (state, {payload}) => {
            state.edit = payload;
        },
        setUserError: errorReducer
    },
    extraReducers: builder => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.entries
                state.total = action.payload.totalPages;
            })
            .addCase(fetchUsers.rejected, errorReducer)
            .addCase(getUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(getUser.rejected, errorReducer)

            .addCase(getMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.loading = false;
                state.me = action.payload;
            })
            .addCase(getMe.rejected, errorReducer)
            .addCase(addUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.submitted = true;
                if (state.edit) {
                    state.selectedUser = action.payload;
                    state.users = state.users.map(user => {
                        if (user.id === action.payload.id) {
                            return {...user, ...action.payload};
                        }
                        return user;
                    });
                } else {
                    state.users.unshift(action.payload)
                }
            })
            .addCase(addUser.rejected, errorReducer)
            .addCase(deleteUser.pending, (state) => {
              state.loading = true;
            })
            .addCase(deleteUser.fulfilled, (state, {payload}) => {
              state.loading = false;
              state.users = state.users.filter(user=>{
                if(user.id !== payload){
                  return user;
                }
              })
            })
            .addCase(deleteUser.rejected, errorReducer)
            .addCase(accountManagement.pending, (state) => {
                state.loading = true;
            })
            .addCase(accountManagement.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.selectedUser = payload;
            })
            .addCase(accountManagement.rejected, errorReducer)

    }
})
export const {clearError, setUserError, setSubmitted, setEditing} = appUsersSlice.actions
export default appUsersSlice.reducer
