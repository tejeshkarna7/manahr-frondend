export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'ManaHR',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  tokenKey: 'manahr_access_token',
  refreshTokenKey: 'manahr_refresh_token',
  userKey: 'manahr_user',
} as const;
