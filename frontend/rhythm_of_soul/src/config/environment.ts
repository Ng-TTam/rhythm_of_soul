export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
  }
  
  export const getEnvironment = (): Environment => {
    const env = process.env.NODE_ENV || Environment.DEVELOPMENT;
    return env as Environment;
  };
  
  export const envConfig = {
    isDev: getEnvironment() === Environment.DEVELOPMENT,
    isProd: getEnvironment() === Environment.PRODUCTION,
    isStaging: getEnvironment() === Environment.STAGING,
  };
  
  export const config = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080',
    appName: process.env.REACT_APP_APP_NAME || 'Rhythm Of Soul',
    timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 5000,
  };