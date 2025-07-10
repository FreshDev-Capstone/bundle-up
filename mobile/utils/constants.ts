const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
console.log(`[Constants] API_BASE_URL loaded: ${apiUrl}`);
console.log(
  `[Constants] Environment variable EXPO_PUBLIC_API_URL: ${process.env.EXPO_PUBLIC_API_URL}`
);

export const API_BASE_URL = apiUrl;
