// API base URL for all backend requests
export const API_BASE_URL = import.meta.env.DEV 
  ? "/api" // Use proxy in development
  : "https://kgk2ao7mte.execute-api.eu-central-1.amazonaws.com"; // Use direct URL in production
