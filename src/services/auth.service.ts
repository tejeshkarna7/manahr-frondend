import { api } from './client';
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  User,
  AuthTokens,
} from '@/types';

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.postResponse<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      credentials
    );
    return response as AuthResponse;
  }

  /**
   * Register new user and organization
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.postResponse<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      data
    );
    return response as AuthResponse;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  /**
   * Request password reset
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    return await api.post('/auth/forgot-password', data);
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    return await api.post('/auth/reset-password', data);
  }

  /**
   * Change password for logged-in user
   */
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return await api.put('/users/change-password', data);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    return await api.post('/auth/refresh-token', { refreshToken });
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    return await api.get('/users/profile');
  }
}

export const authService = new AuthService();
