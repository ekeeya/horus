// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import client from "@src/axios";


export const getCategories = createAsyncThunk('appInventory/getCategories', async (params) => {
    const response = await client.get('/api/v1/inventory/categories', {params})
    return {params, data: response.data.entries}
})
export const getProducts = createAsyncThunk('appInventory/getProducts', async params => {
    const response = await client.get('/api/v1/inventory/inventory-items', {params})
    return {params, data: response.data}
})


export const appInventorySlice = createSlice({
    name: 'appInventory',
    initialState: {
      categories: [],
      loading:false,
        cart: [],
        params: {},
        products: [],
        wishlist: [],
        totalProducts: 0,
        productDetail: {}
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCategories.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.categories = action.payload.data
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.params = action.payload.params
                state.products = action.payload.data.entries
                let limit = action.payload.params.size  ? action.payload.params.size: 10
                state.totalProducts = action.payload.data.totalPages * limit
            })
    }
})

export default appInventorySlice.reducer
