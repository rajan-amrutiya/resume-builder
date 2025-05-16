import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IAuthService } from '../../domain/interfaces/IAuthService';
import { User, EUserRole, EAuthProvider } from '../../domain/entities/User';
import { SignupRequestDto, AuthResponseDto } from '../dtos/AuthDto';

export class SignupUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  /**
   * Execute the signup use case
   * @param request The signup request DTO
   * @returns The authentication response DTO
   */
  async execute(request: SignupRequestDto): Promise<AuthResponseDto> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await this.authService.hashPassword(request.password);

    // Create new user
    const user = User.createLocalUser(
      request.email,
      passwordHash,
      request.firstName,
      request.lastName,
      EUserRole.User
    );

    // Save user to database
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.authService.generateToken(savedUser);

    // Return response DTO
    return {
      userId: savedUser.getId(),
      email: savedUser.getEmail(),
      firstName: savedUser.getFirstName(),
      lastName: savedUser.getLastName(),
      role: savedUser.getRole(),
      token,
      isVerified: savedUser.isUserVerified(),
      authProvider: savedUser.getAuthProvider() as EAuthProvider
    };
  }
} 