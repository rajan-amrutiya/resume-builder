import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Find a user by ID
   * @param id The user ID
   * @returns The user or undefined if not found
   */
  findById(id: number): Promise<User | undefined>;
  
  /**
   * Find a user by email
   * @param email The user email
   * @returns The user or undefined if not found
   */
  findByEmail(email: string): Promise<User | undefined>;
  
  /**
   * Find a user by OAuth provider ID
   * @param provider The auth provider
   * @param providerUserId The provider's user ID
   * @returns The user or undefined if not found
   */
  findByAuthProvider(provider: string, providerUserId: string): Promise<User | undefined>;
  
  /**
   * Save a user
   * @param user The user to save
   * @returns The saved user
   */
  save(user: User): Promise<User>;
  
  /**
   * Delete a user
   * @param id The user ID
   * @returns True if deleted, false otherwise
   */
  delete(id: number): Promise<boolean>;
} 