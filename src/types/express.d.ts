// This adds the user property to Express Request
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
        role: string;
        [key: string]: any;
      };
    }
  }
}

export {}; 