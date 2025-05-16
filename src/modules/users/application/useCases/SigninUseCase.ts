import { IAuthService } from '../../domain/interfaces/IAuthService';
import { EAuthProvider } from '../../domain/entities/User';
import { SigninRequestDto, AuthResponseDto } from '../dtos/AuthDto';

export class SigninUseCase {
  constructor(private authService: IAuthService) {}

  /**
   * Execute the signin use case
   * @param request The signin request DTO
   * @returns The authentication response DTO
   */
  async execute(request: SigninRequestDto): Promise<AuthResponseDto> {
    // Authenticate user
    const user = await this.authService.authenticateUser(request.email, request.password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Return response DTO
    return {
      userId: user.getId(),
      email: user.getEmail(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      role: user.getRole(),
      token,
      isVerified: user.isUserVerified(),
      authProvider: user.getAuthProvider() as EAuthProvider
    };
  }
} 