

import { Response } from 'express';

export interface ApiResponse<T = any> {
  
  success: boolean;
  
  data?: T;
  
  error?: string;
  
  statusCode?: number;
  
  timestamp?: string;
}

export const sendSuccess = (res: Response, data: any, statusCode: number = 200): Response => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
};

export const sendError = (res: Response, error: string, statusCode: number = 400): Response => {
  return res.status(statusCode).json({
    success: false,
    error,
    statusCode,
    timestamp: new Date().toISOString()
  });
};

export const sendInternalError = (res: Response, error: Error): Response => {
  console.error('Internal server error:', error);
  return sendError(res, 'Internal server error', 500);
};

export const sendValidationError = (res: Response, error: string): Response => {
  return sendError(res, error, 400);
};

export const sendAuthError = (res: Response, error: string): Response => {
  return sendError(res, error, 401);
};

export const sendForbiddenError = (res: Response, error: string): Response => {
  return sendError(res, error, 403);
};

export const sendNotFoundError = (res: Response, error: string): Response => {
  return sendError(res, error, 404);
};

export const sendConflictError = (res: Response, error: string): Response => {
  return sendError(res, error, 409);
}; 