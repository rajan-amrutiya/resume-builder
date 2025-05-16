import { EAuthProvider } from '../../domain/entities/User';

// Request DTOs
export interface SignupRequestDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SigninRequestDto {
  email: string;
  password: string;
}

export interface OAuthRequestDto {
  code: string;
  redirectUri?: string;
}

// Response DTOs
export interface AuthResponseDto {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
  isVerified: boolean;
  authProvider: EAuthProvider;
}

// Error responses
export interface AuthErrorDto {
  message: string;
  code: string;
} 