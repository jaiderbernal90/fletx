export default () => ({
  app: {
    port: 'PORT',
    env: 'NODE_ENV',
    cors_origin: 'CORS_ORIGIN',
    authTokenExpiry: 'AUTH_ACCESS_TOKEN_EXPIRY_MS',
    refreshTokenExpiry: 'AUTH_REFRESH_TOKEN_EXPIRY_MS',
    passwordAdmin: 'PASSWORD_ADMIN',
  },
  jwt: {
    secret: 'JWT_SECRET',
  },
});
