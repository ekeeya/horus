 // ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import client, {FORM_DATA_HEADER} from "@src/axios";
import {generateError, mergeArrays} from "@utils";
 import {appUsersSlice} from "@src/views/apps/parents/store";


 const downloadExcelFile = (data, fileName) => {
     const blob = new Blob([data], { type: 'application/octet-stream' }); // Set correct MIME type for .xlsx files
     console.log(blob.size)
     const url = URL.createObjectURL(blob);

     const link = document.createElement('a');
     link.href = url;
     link.setAttribute('download', fileName);
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     URL.revokeObjectURL(url);
 };

export const addItems = createAsyncThunk('appInventory/addItems', async (data, thunkAPI) => {
    try{
        const response = await client.post(
            '/api/v1/inventory/inventory-items',
            data)
        return response.data
    }catch (e){
       return thunkAPI.rejectWithValue(generateError(e))
    }
})

export const addCategories = createAsyncThunk('appInventory/addCategories', async (data, thunkAPI) => {
   try{
       const response = await client.post('/api/v1/inventory/categories',data);
       return response.data
   }catch (error) {
       return thunkAPI.rejectWithValue(generateError(error))
   }
})


export const importCategories = createAsyncThunk('appInventory/importCategories', async (data, thunkAPI) => {
    try{
        const response = await client.post(
            '/api/v1/inventory/import-categories',
            {data})
        return response.data
    }catch (e){
        thunkAPI.rejectWithValue(e)
    }
})

export const importItems = createAsyncThunk('appInventory/importItems', async (data, thunkAPI) => {
    const url = `/api/v1/inventory/import-inventory-items/${data.posId}`
    const {form} = data
    try{
        const response = await client.post(
            url,
            form, {headers:FORM_DATA_HEADER})
        return response.data
    }catch (e){
        return thunkAPI.rejectWithValue(generateError(e))
    }
})
export const getCategories = createAsyncThunk('appInventory/getCategories', async (params) => {
    const response = await client.get('/api/v1/inventory/categories', {params})
    return {params, data: response.data.entries}
})

 export const getOrders = createAsyncThunk('appInventory/getOrders', async (params) => {
     const options = "format" in params ? { responseType: 'blob' }:{};
     const response = await client.get('/api/v1/inventory/orders', {params, ...options})
     if ("format" in params){
         const fileName = `orders-report-${new Date().getTime()}.xlsx`
         downloadExcelFile(response.data, fileName)
     }
     else {
         return {params, data: response.data.entries}
     }
 })


 export const getSales = createAsyncThunk('appInventory/getSales', async (params, thunkAPI) => {
     const options = "format" in params ? { responseType: 'blob' }:{};
     const response = await client.get('/api/v1/inventory/sales', {params, ...options})
     if ("format" in params){
         const fileName = `orders-${new Date().getTime()}.xlsx`
         downloadExcelFile(response.data, fileName)
     }
     if ("format" in params){
         const fileName = `sales-report-${new Date().getTime()}.xlsx`
         downloadExcelFile(response.data, fileName)
     }
     else{
         return {params, data: response.data.entries}
     }
 })
export const getProducts = createAsyncThunk('appInventory/getProducts', async params => {
    const response = await client.get('/api/v1/inventory/inventory-items', {params})
    return {params, data: response.data}
})


 export const deleteItems = createAsyncThunk('appInventory/deleteItems', async (id, thunkAPI )=> {
     try{
          await client.delete(`/api/v1/inventory/inventory-items/${id}`)
          return id
     }catch (e){
         return thunkAPI.rejectWithValue(generateError(e));
     }
 })


export const appInventorySlice = createSlice({
    name: 'appInventory',
    initialState: {
        categories: [],
        loading: false,
        orders:[],
        pages:0,
        params: {},
        sales:[],
        products: [],
        error: null,
        selectedProduct:null,
        totalProducts: 0,
    },
    reducers: {
        setSelectedProduct:(state, action)=>{
            state.selectedProduct =  action.payload
        },
        setLoading :(state, action)=>{
            state.loading = action.payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.categories = action.payload.data
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.products = action.payload.data.entries
                let limit = action.payload.params.size ? action.payload.params.size : 10
                state.totalProducts = action.payload.data.totalPages * limit
            })
            .addCase(addCategories.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories =  mergeArrays(state.categories, action.payload)
            })
            .addCase(addCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(addItems.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(addItems.fulfilled, (state, action) => {
                state.loading = false;
                state.products =  mergeArrays(state.products, action.payload)
                state.totalProducts = state.totalProducts + action.payload.length
            })
            .addCase(addItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(importCategories.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(importCategories.fulfilled, (state, action) => {
                state.loading = false;
                window.location.reload()
            })
            .addCase(importCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.data
            })
            .addCase(importItems.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(importItems.fulfilled, (state, action) => {
                state.loading = false;
                // window.location.reload()
            })
            .addCase(importItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(deleteItems.fulfilled, (state, action) => {
                state.loading = false;
                state.products =  state.products.filter(p=> p.id !== action.payload);
            })
            .addCase(deleteItems.rejected, (state, action) => {
                state.error = action.payload
            })
            .addCase(getOrders.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                if(action.payload) {
                    state.params = action.payload.params;
                    state.orders = action.payload.data;
                    state.pages = action.payload.data.totalPages;
                }
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getSales.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getSales.fulfilled, (state, action) => {
                state.loading = false;
                if(action.payload){
                    state.params = action.payload.params;
                    state.sales = action.payload.data;
                    state.pages = action.payload.data.totalPages;
                }
            })
            .addCase(getSales.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})
 export const {setSelectedProduct, setLoading} = appInventorySlice.actions

export default appInventorySlice.reducer
