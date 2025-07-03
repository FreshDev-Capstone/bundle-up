interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "b2c" | "b2b";
  createdAt: string;
  updatedAt: string;
}

export type { User };
