import bcrypt from 'bcrypt';
import { IAuthService } from '../interfaces/IAuthService';
import { User, EAuthProvider } from '../entities/User';
import { IUserRepository } from '../interfaces/IUserRepository';
import { JwtUtil } from '../../../../shared/utils/jwt.util';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Hash a password using bcrypt
   * @param password The plain text password
   * @returns The hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verify if a password matches a hash
   * @param password The plain text password
   * @param hash The password hash
   * @returns True if password matches hash
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate a JWT token for a user
   * @param user The user
   * @returns The JWT token
   */
  generateToken(user: User): string {
    return JwtUtil.generateToken({
      userId: user.getId(),
      email: user.getEmail(),
      role: user.getRole(),
      firstName: user.getFirstName(),
      lastName: user.getLastName()
    });
  }

  /**
   * Authenticate a user with email and password
   * @param email The user email
   * @param password The user password
   * @returns The authenticated user or null if credentials are invalid
   */
  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    // User not found or not a local authentication user
    if (!user || user.getAuthProvider() !== EAuthProvider.Local) {
      return null;
    }

    // Get password hash
    const passwordHash = user.getPasswordHash();
    if (!passwordHash) {
      return null;
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Authenticate or create a user with OAuth
   * @param email The user email
   * @param firstName The user first name
   * @param lastName The user last name
   * @param provider The OAuth provider
   * @param providerUserId The OAuth provider user ID
   * @returns The authenticated or created user
   */
  async authenticateOrCreateOAuthUser(
    email: string,
    firstName: string,
    lastName: string,
    provider: EAuthProvider,
    providerUserId: string
  ): Promise<User> {
    // Try to find user by provider ID
    let user = await this.userRepository.findByAuthProvider(provider, providerUserId);
    
    if (user) {
      return user;
    }

    // Try to find user by email
    user = await this.userRepository.findByEmail(email);
    
    if (user) {
      // If user exists but has a different provider, we cannot link accounts automatically
      // This could be a security risk if someone tries to access an account using a different provider
      throw new Error('User already exists with a different authentication provider');
    }

    // Create new user
    const newUser = User.createOAuthUser(
      email,
      firstName,
      lastName,
      provider,
      providerUserId
    );

    return this.userRepository.save(newUser);
  }
} 