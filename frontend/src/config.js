// Environment configuration for API URL
// This handles both development and production environments

const getApiUrl = () => {
  // In Create React App, environment variables must be prefixed with REACT_APP_
  // and are embedded at build time
  const envApiUrl = typeof process !== 'undefined' && process.env?.REACT_APP_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Check if we're in production (can check hostname or other indicators)
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use the same origin with /api path
    return window.location.origin + '/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const config = {
  apiUrl: getApiUrl(),
};

export default config;