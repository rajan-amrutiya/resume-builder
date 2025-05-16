import { Request, Response } from 'express';
import { SignupUseCase } from '../../application/useCases/SignupUseCase';
import { SigninUseCase } from '../../application/useCases/SigninUseCase';
import { SignupRequestDto, SigninRequestDto } from '../../application/dtos/AuthDto';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { AuthService } from '../../domain/services/AuthService';

export class AuthController {
  /**
   * Handle user signup
   */
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      // Extract and validate input data
      const signupData: SignupRequestDto = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      };

      // Basic validation
      if (!signupData.email || !signupData.password || !signupData.firstName || !signupData.lastName) {
        res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
        return;
      }

      // Create dependencies and use case
      const userRepository = new UserRepository();
      const authService = new AuthService(userRepository);
      const signupUseCase = new SignupUseCase(userRepository, authService);

      // Execute use case
      const result = await signupUseCase.execute(signupData);

      // Return response
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(400).json({
        success: false,
        message
      });
    }
  }

  /**
   * Handle user signin
   */
  static async signin(req: Request, res: Response): Promise<void> {
    try {
      // Extract and validate input data
      const signinData: SigninRequestDto = {
        email: req.body.email,
        password: req.body.password
      };

      // Basic validation
      if (!signinData.email || !signinData.password) {
        res.status(400).json({
          success: false,
          message: 'Missing email or password'
        });
        return;
      }

      // Create dependencies and use case
      const userRepository = new UserRepository();
      const authService = new AuthService(userRepository);
      const signinUseCase = new SigninUseCase(authService);

      // Execute use case
      const result = await signinUseCase.execute(signinData);

      // Return response
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      res.status(401).json({
        success: false,
        message
      });
    }
  }
} 