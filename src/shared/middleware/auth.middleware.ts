import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';

// Extend Express Request type using declaration merging with ES2015 module syntax
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: number;
      email: string;
      role: string;
      [key: string]: any;
    };
  }
}

export class AuthMiddleware {
  /**
   * Middleware to authenticate requests using JWT
   */
  static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      const token = JwtUtil.extractTokenFromHeader(authHeader);
      
      if (!token) {
        res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        return;
      }
      
      const decodedToken = JwtUtil.verifyToken(token);
      
      if (!decodedToken) {
        res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        return;
      }
      
      // Add user info to request object
      req.user = {
        userId: decodedToken.userId,
        email: decodedToken.email,
        role: decodedToken.role
      };
      
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  
  /**
   * Middleware to check if user has required role
   * @param roles Array of allowed roles
   */
  static authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        if (!req.user) {
          res.status(401).json({ success: false, message: 'Unauthorized: User not authenticated' });
          return;
        }
        
        if (!roles.includes(req.user.role)) {
          res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
          return;
        }
        
        next();
      } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    };
  }
} 