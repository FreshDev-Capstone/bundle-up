import { Request, Response, NextFunction } from "express";

export const validateRequiredFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const fieldList = missingFields.join(", ");
      res.status(400).json({
        success: false,
        error: `Missing required fields: ${fieldList}`,
        statusCode: 400,
      });
      return;
    }

    next();
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return Boolean(password && password.length >= 8);
};

export const validateNumber = (
  value: any,
  min?: number,
  max?: number
): boolean => {
  const num = Number(value);

  if (isNaN(num)) {
    return false;
  }

  if (min !== undefined && num < min) {
    return false;
  }

  if (max !== undefined && num > max) {
    return false;
  }

  return true;
};

export const validateStringLength = (
  value: string,
  minLength?: number,
  maxLength?: number
): boolean => {
  if (!value || typeof value !== "string") {
    return false;
  }

  if (minLength !== undefined && value.length < minLength) {
    return false;
  }

  if (maxLength !== undefined && value.length > maxLength) {
    return false;
  }

  return true;
};

export const validateEnum = (value: any, allowedValues: any[]): boolean => {
  return allowedValues.includes(value);
};

export const sanitizeRequestBody = (
  body: any,
  sensitiveFields: string[] = ["password", "token", "refreshToken"]
): any => {
  if (!body || typeof body !== "object") {
    return body;
  }

  const sanitized = { ...body };

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = "[REDACTED]";
    }
  });

  return sanitized;
};
