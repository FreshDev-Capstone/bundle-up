// Extend Express types to include custom properties
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: "admin" | "b2c" | "b2b";
      };
    }
  }
}

export {};
