import { User } from '../entities/User';

export interface IAuthService {
  /**
   * Hash a password
   * @param password The plain text password
   * @returns The hashed password
   */
  hashPassword(password: string): Promise<string>;
  
  /**
   * Verify if a password matches a hash
   * @param password The plain text password
   * @param hash The password hash
   * @returns True if password matches hash
   */
  verifyPassword(password: string, hash: string): Promise<boolean>;
  
  /**
   * Generate a JWT token for a user
   * @param user The user
   * @returns The JWT token
   */
  generateToken(user: User): string;
  
  /**
   * Authenticate a user with email and password
   * @param email The user email
   * @param password The user password
   * @returns The authenticated user or null if credentials are invalid
   */
  authenticateUser(email: string, password: string): Promise<User | null>;
} 