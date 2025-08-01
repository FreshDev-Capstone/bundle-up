// Express type extensions
declare global {
  namespace Express {
    interface Request {
      currentUser?: {
        id: string;
        email?: string;
        role?: "admin" | "b2c" | "b2b";
      };
    }
  }
}

export {};
