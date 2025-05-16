import 'express';

declare module 'express' {
  interface Request {
    user?: {
      userId: number;
      email: string;
      role: string;
      [key: string]: any;
    };
  }
} 