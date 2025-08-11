import { Response } from "express";

/**
 * Send a standardized error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  details?: any
) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    ...(details && { details }),
  });
};

/**
 * Send a standardized success response
 */
export const sendSuccess = (
  res: Response,
  data: any,
  message?: string,
  statusCode: number = 200
) => {
  res.status(statusCode).json({
    success: true,
    data,
    ...(message && { message }),
    statusCode,
  });
};

/**
 * Send a standardized paginated response
 */
export const sendPaginatedResponse = (
  res: Response,
  data: any[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
  message?: string
) => {
  res.status(200).json({
    success: true,
    data,
    pagination,
    ...(message && { message }),
    statusCode: 200,
  });
};

/**
 * Send a standardized internal server error response
 */
export const sendInternalError = (
  res: Response,
  message: string = "Internal server error",
  details?: any
) => {
  res.status(500).json({
    success: false,
    error: message,
    statusCode: 500,
    ...(details && { details }),
  });
};

/**
 * Send a standardized not found error response
 */
export const sendNotFoundError = (
  res: Response,
  message: string = "Resource not found",
  details?: any
) => {
  res.status(404).json({
    success: false,
    error: message,
    statusCode: 404,
    ...(details && { details }),
  });
};
