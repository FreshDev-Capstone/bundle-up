import { createApiClient } from '@bundle-up/api-client';

// In production, replace with your API URL from environment config
const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3001/api';

export const apiClient = createApiClient(API_URL);
