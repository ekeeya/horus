import client, {FORM_DATA_HEADER} from '../../../../axios';

// ** Redux Imports
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {generateError} from '@utils';
import toast from "react-hot-toast";


export const fetchStudents = createAsyncThunk('appStudent/fetchStudents', async (configs, thunkAPI) => {
    try {
        const {page} = configs;
        delete configs['page'];
        let url = `/api/v1/students?page=${page}`;
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

export const registerStudent = createAsyncThunk('appStudent/registerStudent', async (student, thunkAPI) => {
    try {
        const response = await client.post('/api/v1/student/register', student);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const getStudent = createAsyncThunk('appStudent/getStudent', async (id, thunkAPI) => {
    try {
        const response = await client.get(`/api/v1/get-student/${id}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});

export const getLinkRequests = createAsyncThunk('appStudent/getLinkRequests', async (configs, thunkAPI) => {
    try {
        const {page} = configs;
        delete configs['page'];
        let url = `/api/v1/get-approval-requests?page=${page}`;
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
});

export const bulkStudentUpload  = createAsyncThunk('appStudent/bulkStudentUpload', async (formData, thunkAPI) => {
    try {
        const schoolId = formData.get("schoolId");
        let url = `/api/v1/bulky-load-students/${schoolId}`;
        const headers = FORM_DATA_HEADER;
        const response = await client.post(url, formData, {headers});
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
})
export const getCardProvisioningRequests = createAsyncThunk('appStudent/getCardProvisioningRequests', async (configs, thunkAPI) => {
    try {
        const {page} = configs;
        delete configs['page'];
        let url = `/api/v1/provisioning/requests?page=${page}`;
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

export const markProvisioned = createAsyncThunk('appStudent/markProvisioned', async (payload, thunkAPI) => {
    try {
        const response = await client.post(`/api/v1/mark-provisioned`, payload);
        return response.data.entries;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});
export const approveLinkRequest = createAsyncThunk('appStudent/approveLinkRequest', async (payload, thunkAPI) => {
    try {
        const response = await client.post(`/api/v1/approve-parent-child-link`, payload);
        return response.data.entries;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});


export const walletManagement = createAsyncThunk('appStudent/walletManagement', async (payload, thunkAPI) => {
    try {
        const response = await client.post(`/api/v1/wallet/wallet-management`, payload);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(generateError(error))
    }
});

export const appStudentSlice = createSlice({
    name: 'appStudent',
    initialState: {
        loading: false,
        students: [],
        pages: 0,
        edit: false,
        submitted:false,
        selectedStudent: null,
        linkRequests: [],
        cardProvisioningNotifications: [],
        error: null
    },
    reducers: {
        setEdit: (state, {payload}) => {
            state.edit = payload
        },
        setSelectedStudent: (state, {payload}) => {
            state.selectedStudent = payload
        },
        clearError: (state) => {
            state.error = null;
        }

    },
    extraReducers: builder => {
        builder
            .addCase(
                fetchStudents.pending, (state) => {
                    state.loading = true
                }
            )
            .addCase(
                fetchStudents.fulfilled, (state, action) => {
                    state.loading = false;
                    state.students = action.payload.entries;
                    state.pages = action.payload.totalPages;
                },
            )
            .addCase(fetchStudents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(
                registerStudent.pending, (state) => {
                    state.loading = true
                }
            ).addCase(
            registerStudent.fulfilled, (state, action) => {
                state.loading = false
                let editing = false;
                state.students = state.students.map(student => {
                    if (student.id === action.payload.id) {
                        editing = true;
                        return {...student, ...action.payload};
                    }
                    return student;
                });
                if (editing) {
                    state.selectedStudent = action.payload;
                }
                !editing && state.students.unshift(action.payload)
                let msg = "";
                msg = editing ? "Student successfully updated" : "Student successfully registered";
                toast.success(msg, {position: "top-center"})
            }
        ).addCase(
            registerStudent.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        )
            .addCase(
                bulkStudentUpload.pending, (state) => {
                    state.loading = true
                }
            ).addCase(
            bulkStudentUpload.fulfilled, (state, action) => {
                state.loading = false
                state.submitted=true
                toast.success(action.payload.message, {position: "top-center"})
            }
        ).addCase(
            bulkStudentUpload.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            },
        )

            .addCase(
            getStudent.pending, (state) => {
                state.loading = true
            }
        ).addCase(
            getStudent.fulfilled, (state, action) => {
                state.loading = false
                state.selectedStudent = action.payload
            }
        ).addCase(
            getStudent.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }
        )
            .addCase(walletManagement.pending, (state) => {
                state.loading = true;
            })
            .addCase(walletManagement.fulfilled, (state, {payload}) => {
                console.log(payload)
                state.loading = false;
                state.selectedStudent = payload;
            })
            .addCase(walletManagement.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(getLinkRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getLinkRequests.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.linkRequests = payload.entries;
                state.pages = payload.totalPages

            })
            .addCase(getLinkRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(approveLinkRequest.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveLinkRequest.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.linkRequests= state.linkRequests.map((request) => {
                    const similar = payload.find((r) => r.id === request.id);
                    if (similar) {
                        return {...request, ...similar};// merge properties
                    }
                    return request;
                });
            })
            .addCase(approveLinkRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })

            .addCase(getCardProvisioningRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCardProvisioningRequests.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.cardProvisioningNotifications = payload.entries;
                state.pages = payload.totalPages;
            })
            .addCase(getCardProvisioningRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(markProvisioned.pending, (state) => {
                state.loading = true;
            })
            .addCase(markProvisioned.fulfilled, (state, {payload}) => {
                state.loading = false;
                state.cardProvisioningNotifications = state.cardProvisioningNotifications.map((notification) => {
                    const similar = payload.find((n) => n.id === notification.id);
                    if (similar) {
                        return {...notification, ...similar};// merge properties
                    }
                    return notification;
                });
            })
            .addCase(markProvisioned.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
    }
})

export const {setEdit, setSelectedStudent, clearError} = appStudentSlice.actions

export default appStudentSlice.reducer
