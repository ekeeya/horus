// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import client from "@src/axios";
import {generateError} from "@utils";

export const fetchTransactions = createAsyncThunk('appTransactions/fetchTransactions', async (configs, thunkAPI) => {
    try {
        let {page} = configs;
        delete configs['page'];
        if(page === undefined || page === null){
            page = 0
        }
        let url = `/api/v1/transactions?page=${page}`;
        const specialKeys = ["lowerDate", "upperDate"]
        Object.keys(configs).forEach(key => {
            if (configs[key] != null || configs[key] !== "") {
                if(specialKeys.includes(key) ){
                    url += `&${key}=${encodeURIComponent(configs[key])}`
                }
                else{
                    url += `&${key}=${configs[key]}`
                }
            }
        });
        const options = "format" in configs ? { responseType: 'blob' }:{};
        const response = await client.get(url, options);
        if ("format" in configs){
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const time = new Date()
            link.setAttribute('download', `transactions-${time.getTime()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }else{
            return response.data;
        }
        return {}
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const appTransactionSlice = createSlice({
    name: 'appTransactions',
    initialState: {
        transactions: [],
        pages: 1,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTransactions.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.entries){
                    state.transactions = action.payload.entries;
                    state.pages = action.payload.totalPages
                }

            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export default appTransactionSlice.reducer
