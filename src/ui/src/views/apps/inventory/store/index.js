 // ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import client, {FORM_DATA_HEADER} from "@src/axios";
import {generateError, mergeArrays} from "@utils";
 import {appUsersSlice} from "@src/views/apps/parents/store";


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
       console.log(response)
       return response.data
   }catch (e) {
       return thunkAPI.rejectWithValue(generateError(e))
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
        cart: [],
        params: {},
        products: [],
        error: null,
        selectedProduct:null,
        totalProducts: 0,
    },
    reducers: {
        setSelectedProduct:(state, action)=>{
            state.selectedProduct =  action.payload
        }
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
    }
})
 export const {setSelectedProduct} = appInventorySlice.actions

export default appInventorySlice.reducer
