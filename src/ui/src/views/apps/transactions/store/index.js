// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import client from "@src/axios";
import {generateError} from "@utils";

export const fetchTransactions = createAsyncThunk('appTransactions/fetchTransactions', async (configs, thunkAPI) => {
    try {
        let {page, student} = configs;
        delete configs['page'];
        if(page === undefined || page === null){
            page = 0
        }
        let url;
        if (student){
           url = `/api/v1/transactions/${student}?page=${page}`;
           delete configs["student"]
        }else{
            url= `/api/v1/transactions?page=${page}`;
        }
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
            return {type:configs.type, data:response.data};
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
        expenditures:[],
        deposits:[],
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
                const {data, type} =  action.payload;
                if (data.entries){
                    state.transactions = data.entries;
                    state.pages = action.payload.totalPages
                }
                if (type === "PAYMENT"){
                    state.expenditures = data.entries;
                }else{
                    state.deposits = data.entries;
                }
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export default appTransactionSlice.reducer
