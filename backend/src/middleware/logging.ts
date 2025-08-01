import { Request, Response, NextFunction } from "express";

export const logRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`${req.method} ${req.path}`);
  next();
};

export const logRequests = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(`Request: ${req.method} ${req.path}`, {
    body: req.body,
    query: req.query,
    params: req.params,
  });
  next();
};

export const logErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", error);
  next(error);
};

export const logResponses = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`Response: ${req.method} ${req.path}`, {
      status: res.statusCode,
      data: data,
    });
    return originalSend.call(this, data);
  };
  next();
};

export const logDatabaseErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Database Error:", error);
  next(error);
};

export const logAuthErrors = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Auth Error:", error);
  next(error);
};
