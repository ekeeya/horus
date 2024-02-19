import client from '../../../../axios';

// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {generateError} from '@utils';
import toast from "react-hot-toast";


export const fetchSchools = createAsyncThunk('appSchool/fetchSchools', async (configs, thunkAPI) => {
    try {
        const {page} = configs;
        delete configs['page'];
        let url = `/api/v1/schools?page=${page}`;
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

export const fetchSchool = createAsyncThunk('appSchool/fetchSchool', async (schoolId, thunkAPI) => {
    try {
        let url = `/api/v1/schools/${schoolId}`;
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})


export const registerSchool = createAsyncThunk('appSchool/registerSchool', async (school, thunkAPI) => {
    try {
        const response = await client.post('/api/v1/school/register', school);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const registerPosCenter = createAsyncThunk('appSchool/registerPosCenter', async (pos, thunkAPI) => {
    try {
        const response = await client.post('/api/v1/register-pos-center', pos);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})


export const fetchPosCenters = createAsyncThunk('appSchool/fetchPosCenters', async (schoolId, thunkAPI) => {
    try {
        const url = schoolId ? `/api/v1/pos-centers?schoolId=${schoolId}` : `/api/v1/pos-centers`;
        const response = await client.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})

export const attachDetachAttendants = createAsyncThunk('appSchool/attachDetachAttendants', async (payload, thunkAPI) => {

    try {
        const url = `/api/v1/add-remove-pos-attendant`;
        const response = await client.post(url, payload);
        return response.data.message
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});
export const appSchoolSlice = createSlice({
    name: 'appSchool',
    initialState: {
        loading: false,
        schools: [],
        posCenters: [],
        selectedPosCenter: null,
        pages: 0,
        posPages:0,
        edit: false,
        selectedSchool: null,
        error: null
    },
    reducers: {
        setEdit: (state, {payload}) => {
            state.edit = payload
        },
        setSelectedSchool: (state, {payload}) => {
            state.selectedSchool = payload
        },
        setSelectedPosCenter: (state, {payload}) => {
            state.selectedPosCenter = payload
        },
        clearError: (state) => {
            state.error = null;
        }

    },
    extraReducers: builder => {
        builder

            .addCase(
                fetchSchool.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                fetchSchool.fulfilled, (state, action) => {
                    state.loading = false
                    state.selectedSchool = action.payload
                },
            )
            .addCase(fetchSchool.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(
                fetchSchools.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                fetchSchools.fulfilled, (state, action) => {
                    state.loading = false
                    state.schools = action.payload.entries
                },
            )
            .addCase(fetchSchools.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(
                registerSchool.pending, (state) => {
                    state.loading = true
                }
            ).addCase(
            registerSchool.fulfilled, (state, action) => {
                state.loading = false
                let editing = false;
                state.schools = state.schools.map(school => {
                    if (school.id === action.payload.data.id) {
                        editing = true;
                        return {...school, ...action.payload.data};
                    }
                    return school;
                });
                !editing && state.schools.unshift(action.payload.data)
                if(editing){
                    toast.success(`${action.payload.data.name} has been successfully added`,{position:"top-center"})
                }else{
                    toast.success(`${action.payload.data.name} has been successfully added`,{position:"top-center"})
                }

                //state.pages = action.payload.totalPages
            }
        ).addCase(
            registerSchool.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        )
            .addCase(
                fetchPosCenters.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                fetchPosCenters.fulfilled, (state, action) => {
                    state.loading = false
                    state.posCenters = action.payload.entries
                    state.posPages = action.payload.totalPages
                },
            )
            .addCase(fetchPosCenters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(
                registerPosCenter.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                registerPosCenter.fulfilled, (state, action) => {
                    state.loading = false
                    let editing = false;
                    state.posCenters = state.posCenters.map(pos => {
                        if (pos.id === action.payload.data.id) {
                            editing = true;
                            return {...pos, ...action.payload.data};
                        }
                        return pos;
                    });
                    !editing && state.posCenters.unshift(action.payload.data)
                },
            )
            .addCase(registerPosCenter.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(
                attachDetachAttendants.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                attachDetachAttendants.fulfilled, (state, action) => {
                    state.loading = false
                    toast.success(action.payload, {position: "top-right"});
                },
            )
            .addCase(attachDetachAttendants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export const {setEdit, setSelectedSchool, clearError, setSelectedPosCenter} = appSchoolSlice.actions

export default appSchoolSlice.reducer
