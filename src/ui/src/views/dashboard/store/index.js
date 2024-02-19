import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import client from "@src/axios";
import {generateError} from "@utils";


export const fetchStatistics = createAsyncThunk('dashboard/fetchPosCenters', async (schoolId, thunkAPI) => {
    try {
        const url = `/api/v1/dashboard/statistics`
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const fetchLinkRequestSummary = createAsyncThunk('dashboard/fetchLinkRequestSummary', async (schoolId, thunkAPI) => {
    try {
        const url = `/api/v1/dashboard/link-requests-summary`
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const fetchPosSalesSummary = createAsyncThunk('dashboard/fetchPosSalesSummary', async (schoolId, thunkAPI) => {
    try {
        const url = `/api/v1/dashboard/pos-sales-summary`
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const fetchSchoolSalesSummary = createAsyncThunk('dashboard/fetchSchoolSalesSummary', async (schoolId, thunkAPI) => {
    try {
        const url = `/api/v1/dashboard/school-sales-summary`
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const fetchCardProvisioningRequestsSummary = createAsyncThunk('dashboard/fetchCardProvisioningRequestsSummary', async (schoolId, thunkAPI) => {
    try {
        const url = `/api/v1/dashboard/provision-requests-summary`
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        loading: false,
        statistics:null,
        linkRequestSummary:null,
        linkFetching:false,
        provisioningFetching:false,
        cardProvisioningRequestsSummary:null,
        posSales:null,
        schoolSales:null,
        fetchingSchoolSales:false,
        fetchingPosSales:false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }

    },
    extraReducers: builder => {
        builder
            .addCase(
                fetchStatistics.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                fetchStatistics.fulfilled, (state, action) => {
                    state.loading = false
                    state.statistics = action.payload
                },
            )
            .addCase(fetchStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(
                fetchLinkRequestSummary.pending, (state) => {
                    state.linkFetching = true
                }
            )
            .addCase(
                fetchLinkRequestSummary.fulfilled, (state, action) => {
                    state.linkFetching = false
                    state.linkRequestSummary = action.payload
                },
            )
            .addCase(fetchLinkRequestSummary.rejected, (state, action) => {
                state.linkFetching = false;
                state.error = action.payload;
            })
            .addCase(
                fetchPosSalesSummary.pending, (state) => {
                state.fetchingPosSales = true
            } )
            .addCase(
                fetchPosSalesSummary.fulfilled, (state, action) => {
                    state.fetchingPosSales = false
                    state.posSales = action.payload
                },
            )
            .addCase(fetchPosSalesSummary.rejected, (state, action) => {
                state.fetchingPosSales = false;
                state.error = action.payload;
            })


            .addCase(
                fetchSchoolSalesSummary.pending, (state) => {
                    state.fetchingSchoolSales = true
                } )
            .addCase(
                fetchSchoolSalesSummary.fulfilled, (state, action) => {
                    state.fetchingSchoolSales = false
                    state.schoolSales = action.payload
                },
            )
            .addCase(fetchSchoolSalesSummary.rejected, (state, action) => {
                state.fetchingSchoolSales = false;
                state.error = action.payload;
            })

            .addCase(
                fetchCardProvisioningRequestsSummary.pending, (state) => {
                    state.provisioningFetching = true
                } )
            .addCase(
                fetchCardProvisioningRequestsSummary.fulfilled, (state, action) => {
                    state.provisioningFetching = false
                    state.cardProvisioningRequestsSummary = action.payload
                },
            )
            .addCase(fetchCardProvisioningRequestsSummary.rejected, (state, action) => {
                state.provisioningFetching = false;
                state.error = action.payload;
            })


    }
})

export const {clearError, setSelectedPosCenter} = dashboardSlice.actions
export default dashboardSlice.reducer