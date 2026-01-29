// Environment configuration for API URL
// This handles both development and production environments

const getApiUrl = () => {
  // In Vite, environment variables must be prefixed with VITE_
  // and are available via import.meta.env
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Check if we're in production (can check hostname or other indicators)
  const isProduction = window.location.hostname !== 'localhost' && 
                       window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use the Render backend URL
    return 'https://student-portal-1-ou9o.onrender.com/api';
  }
  
  // Default to localhost for development
  return 'http://localhost:5000/api';
};

const config = {
  apiUrl: getApiUrl(),
};

export default config;