// Import the API configuration from the config file
import { API_BASE_URL as configApiUrl } from "../config/apiConfig";

const apiUrl = configApiUrl;
console.log(`[Constants] API_BASE_URL loaded: ${apiUrl}`);
console.log(
  `[Constants] Environment variable EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL}`
);

export const API_BASE_URL = apiUrl;
