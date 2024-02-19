// ** Redux Imports
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt'
import toast from "react-hot-toast";
import {generateError} from "@utils";
import jwt from "@src/auth/jwt/useJwt";

const config = useJwt.jwtConfig

const initialUser = () => {
  const item = window.localStorage.getItem('userData')
  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}
const initialAccessToken = ()=>{
  const accessToken = window.localStorage.getItem(config.storageTokenKeyName)
  return accessToken ? JSON.parse(accessToken) : null
}
const initialRefreshToken = ()=>{
  const refreshToken = window.localStorage.getItem(config.storageRefreshTokenKeyName)
  return refreshToken ? JSON.parse(refreshToken) : null
}

export const refreshTokens = createAsyncThunk('authentication/refreshToken', async (data, thunkAPI) => {
  try{
    const response = await jwt.refreshToken();
    jwt.setToken(response.data.access_token)
    jwt.setRefreshToken(response.data.refresh_token)
    jwt.onAccessTokenFetched(response.data.access_token)
    return response.data
  }catch (error){
    return thunkAPI.rejectWithValue(generateError(error));
  }
})

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    loading:false,
    userData: initialUser(),
    accessToken:initialAccessToken(),
    refreshToken:initialRefreshToken(),
  },
  reducers: {
    setLoading:(state, action)=>{
        state.loading = action.payload
    },
    handleLogin: (state, action) => {
      state.userData = action.payload
      state["accessToken"] = action.payload.accessToken
      state["refreshToken"]=action.payload.refreshToken
      state[config.storageTokenKeyName] = action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] = action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem(config.storageTokenKeyName, JSON.stringify(action.payload.accessToken))
      localStorage.setItem(config.storageRefreshTokenKeyName, JSON.stringify(action.payload.refreshToken))
    },
      handleLogout: state => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.removeItem('userData')
      localStorage.removeItem(config.storageTokenKeyName)
      localStorage.removeItem(config.storageRefreshTokenKeyName)
    }
  }, extraReducers: builder => {
    builder
        .addCase(refreshTokens.fulfilled, (state, action) => {
          console.log(action.payload)
          state.accessToken = action.payload.access_token
          state.refreshToken=action.payload.refresh_token
        })
        .addCase(refreshTokens.rejected, (state, action) => {
          console.log("Log you out")
          toast.error("Could not reload tokens",{position:"bottom-right"});
        })
  }
})

export const { handleLogin, handleLogout,setLoading } = authSlice.actions

export default authSlice.reducer
