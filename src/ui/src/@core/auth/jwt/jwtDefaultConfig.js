// ** Auth Endpoints
export default {
  loginEndpoint: '/login',
  registerEndpoint: '/api/v1/users/register',
  refreshEndpoint: '/api/v1/users/tokens/refresh',
  logoutEndpoint: '/jwt/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken'
}
