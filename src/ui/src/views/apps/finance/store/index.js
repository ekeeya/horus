import client from '../../../../axios';

// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {generateError} from '@utils';
import toast from "react-hot-toast";






export const makeWithdrawRequest = createAsyncThunk('appWithdrawRequests/makeWithdrawRequest', async (data, thunkAPI) => {
    try {
        const response = await client.post('/api/v1/finance/withdraw-requests/create', data);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const fetchWithdrawRequests = createAsyncThunk('appWithdrawRequests/fetchWithdrawRequests', async (configs, thunkAPI) => {
    try {
        let {page} = configs;
        page = page ? page : 0
        delete configs['page'];
        let url = `/api/v1/finance/withdraw-requests?page=${page}`;
        Object.keys(configs).forEach(key => {
            if (configs[key] != null || configs[key] !== "") {
                url += `&${key}=${configs[key]}`
            }
        });
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const getRequest = createAsyncThunk('appWithdrawRequests/getRequest', async (id, thunkAPI) => {
    try {
        const response = await client.get(`/api/v1/finance/withdraw-requests/${id}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});

export const approveCancel = createAsyncThunk('appWithdrawRequests/approveCancel', async (params, thunkAPI) => {
    try {
        const {id, action} = params;
        const response = await client.get(`/api/v1/finance/approve-cancel/${id}?action=${action}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});

export const markProcessed = createAsyncThunk('appWithdrawRequests/markProcessed', async (payload, thunkAPI) => {
    try {
        const response = await client.post(`/api/v1/finance/mark-processed`, payload);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});

export const appFinanceSlice = createSlice({
    name: 'appFinance',
    initialState: {
        loading: false,
        withdrawRequests: [],
        selectedRequest:null,
        pages: 0,
        edit:false,
        error: null
    },
    reducers: {
        setEdit: (state, {payload}) => {
            state.edit = payload
        },
        setSelectedRequest: (state, {payload}) => {
            state.selectedRequest = payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(
                makeWithdrawRequest.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                makeWithdrawRequest.fulfilled, (state, action) => {
                    state.loading = false;
                    state.withdrawRequests.unshift(action.payload);
                    const msg = "A request to withdraw money has been sent. Click details to track it's progress"
                    toast.success(msg, {position: "top-center"})
                },
            )
            .addCase(makeWithdrawRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(
                fetchWithdrawRequests.pending, (state) => {
                    state.loading = true
                }
            ).addCase(
            fetchWithdrawRequests.fulfilled, (state, action) => {
                state.loading = false
                state.withdrawRequests =  action.payload.entries
                state.pages =  action.payload.totalPages;
            }
        ).addCase(
            fetchWithdrawRequests.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        ).addCase(
            getRequest.pending, (state) => {
                state.loading = true
            }
        ).addCase(
            getRequest.fulfilled, (state, action) => {
                state.loading = false
                state.selectedRequest = action.payload
            }
        ).addCase(
            getRequest.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }
        )
            .addCase(approveCancel.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveCancel.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.withdrawRequests = state.withdrawRequests.map(r => {
                    if (r.id === payload.id) {
                        return {...r, ...payload};
                    }
                    return r;
                });

            })
            .addCase(approveCancel.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(markProcessed.pending, (state) => {
                state.loading = true;
            })
            .addCase(markProcessed.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.selectedRequest = payload;

            })
            .addCase(markProcessed.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
});

export const {setSelectedRequest, setEdit} = appFinanceSlice.actions
export default appFinanceSlice.reducer
