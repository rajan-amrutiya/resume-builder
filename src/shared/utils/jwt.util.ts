import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

export interface IJwtPayload {
  userId: number;
  email: string;
  role: string;
  [key: string]: any;
}

export class JwtUtil {
  /**
   * Generate a JWT token for a user
   * @param payload The payload to include in the token
   * @returns The generated JWT token
   */
  static generateToken(payload: IJwtPayload): string {
    // Use @ts-ignore to bypass type checking for the jwt.sign call
    // This is necessary because of a mismatch between the library's actual behavior
    // and its TypeScript type definitions
    
    // @ts-ignore
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Verify and decode a JWT token
   * @param token The token to verify
   * @returns The decoded token payload or null if invalid
   */
  static verifyToken(token: string): IJwtPayload | null {
    try {
      // @ts-ignore
      return jwt.verify(token, JWT_SECRET) as IJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract token from authorization header
   * @param authHeader The authorization header
   * @returns The token or null if not found
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
  }
} 