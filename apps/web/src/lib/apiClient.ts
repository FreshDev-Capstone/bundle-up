import { createApiClient } from '@bundle-up/api-client';

const API_URL = import.meta.env['VITE_API_URL'] ?? '/api';

export const apiClient = createApiClient(API_URL);
