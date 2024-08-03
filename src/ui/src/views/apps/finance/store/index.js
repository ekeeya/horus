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

export const fetchVirtualAccounts = createAsyncThunk('appWithdrawRequests/fetchVirtualAccounts', async (configs, thunkAPI) => {
    try {
        let url = `/api/v1/wallet/virtual-accounts`;
        let {schoolId} = configs;
        if (schoolId){
            url =`${url}?schoolId=${schoolId}`
        }
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const fetchAllowedWithdrawPaymentAccountBalance = createAsyncThunk('appWithdrawRequests/fetchAllowedWithdrawPaymentAccountBalance', async (configs, thunkAPI) => {
    try {
        let url = `/api/v1/wallet/allowed-withdraw-amount`;
        const {lowerDate, upperDate} = configs;
        if(lowerDate){
            url = `${url}?lowerDate=${lowerDate}&upperDate=${upperDate}`
        }
        const response = await client.get(url);
        return response.data;
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
        virtualAccounts:[],
        showWithDrawModal:false,
        virtualPaymentAccount:{},
        allowedWithdrawAmount:0,
        selectedRequest: null,
        account:{balance:0},
        pages: 0,
        edit: false,
        error: null
    },
    reducers: {

        setVirtualAccount:(state, {payload})=>{
            state.account = payload;
        },
        setEdit: (state, {payload}) => {
            state.edit = payload
        },
        setShowWithdrawModal: (state, {payload}) => {
            state.showWithDrawModal = payload
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
                state.withdrawRequests = action.payload.entries
                state.pages = action.payload.totalPages;
            }
            ).addCase(
            fetchWithdrawRequests.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        )
            .addCase(
                fetchVirtualAccounts.pending, (state) => {
                    state.loading = true
                }
            ).addCase(
            fetchVirtualAccounts.fulfilled, (state, action) => {
                state.loading = false
                state.virtualAccounts = action.payload.data
                action.payload.data.forEach((account)=>{
                    if (account.accountType === "SCHOOL_PAYMENT"){
                        state.virtualPaymentAccount = account;
                        state.allowedWithdrawAmount = account.balance;
                    }
                })
            }
        ).addCase(
            fetchVirtualAccounts.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        )

            .addCase(
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

            .addCase(fetchAllowedWithdrawPaymentAccountBalance.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllowedWithdrawPaymentAccountBalance.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.allowedWithdrawAmount = payload.data;
            })
            .addCase(fetchAllowedWithdrawPaymentAccountBalance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
});

export const {setSelectedRequest, setEdit, setVirtualAccount,setShowWithdrawModal} = appFinanceSlice.actions
export default appFinanceSlice.reducer
