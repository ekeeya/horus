import jwtDefaultConfig from './jwtDefaultConfig'
import client, {FORM_DATA_HEADER} from '../../../axios';
import {store} from "@store/store";
import {handleLogout} from "@store/authentication";

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    client.interceptors.request.use(
      config => {
        // ** Get token from localStorage
        const {url} =  config;
        if(url === this.jwtConfig.refreshEndpoint){
          const refreshToken  = this.getRefreshToken();
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${refreshToken.token}`
        }else{
          const accessToken = this.getToken();
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken.token}`
        }
        return config
      },
      error => Promise.reject(error)
    )
      client.interceptors.response.use((res)=>{
          return res;
      }, error => {
          // log user out
          if (error.response.status === 403){
              // we session expired logout User
              const { dispatch} = store;
              console.log("Session expired, logging you out")
              dispatch(handleLogout())
          }
          return Promise.reject(error);
      })

  }

   tokenIsExpired (createdAt, expiresIn){
    const now =  new Date()
    const expireDate = new Date(createdAt);
    const expireDateEpoch = expireDate.getTime() + expiresIn;
    const nowEpoch = now.getTime()
    const diff = expireDateEpoch - nowEpoch;
    return diff <= 10000;
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter(callback => callback(accessToken.token))
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    const accessToken = localStorage.getItem(this.jwtConfig.storageTokenKeyName);
    const o = accessToken ? JSON.parse(accessToken) : {}
    return o;
  }

  getRefreshToken() {
    const refreshToken = localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
    return refreshToken ? JSON.parse(refreshToken) : {};
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, JSON.stringify(value))
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, JSON.stringify(value))
  }

  login(...args) {
    const headers = FORM_DATA_HEADER;
    return client.post(this.jwtConfig.loginEndpoint, ...args, {headers})
  }

  register(...args) {
    return client.post(this.jwtConfig.registerEndpoint, ...args)
  }

  refreshToken() {
    return client.get(this.jwtConfig.refreshEndpoint)
  }
}
