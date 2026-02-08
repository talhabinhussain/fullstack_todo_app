/**
 * Token management utility for handling JWT tokens in the frontend
 */
export class TokenManager {
  private static TOKEN_KEY = 'auth-token';
  private static REFRESH_TOKEN_KEY = 'auth-refresh-token';

  /**
   * Store the authentication token
   */
  static storeTokens(accessToken: string, refreshToken?: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, accessToken);

      if (refreshToken) {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
      }
    }
  }

  /**
   * Retrieve the access token
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Retrieve the refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Remove stored tokens
   */
  static removeTokens() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Check if the token is expired
   */
  static isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return false; // Token doesn't have expiration

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  }

  /**
   * Decode a JWT token without verifying signature (for getting payload)
   */
  static decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = parts[1];
      // Replace URL-safe base64 characters with standard base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string | null): Date | null {
    if (!token) return null;

    try {
      const payload = this.decodeToken(token);
      if (!payload.exp) return null;

      return new Date(payload.exp * 1000);
    } catch (error) {
      console.error('Error getting token expiration:', error);
      return null;
    }
  }

  /**
   * Check if token needs refresh (expires within 5 minutes)
   */
  static tokenNeedsRefresh(token: string | null): boolean {
    const expiration = this.getTokenExpiration(token);
    if (!expiration) return true;

    const fiveMinutesInMillis = 5 * 60 * 1000;
    const timeUntilExpiry = expiration.getTime() - Date.now();

    return timeUntilExpiry < fiveMinutesInMillis;
  }
}