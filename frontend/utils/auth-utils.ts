/**
 * Utility functions for handling authentication state
 */

// Function to get the user ID from the session
export const getUserIdFromSession = (session: any): string | null => {
  if (session && session.user && session.user.id) {
    return session.user.id;
  }
  return null;
};

// Function to check if a token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    // Decode the JWT token to check expiration
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    return exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Assume expired if we can't decode
  }
};

// Function to refresh token if needed
export const refreshTokenIfNeeded = async (currentToken: string): Promise<string> => {
  // In a real implementation, this would call the backend to refresh the token
  // For now, we'll just return the current token
  if (!isTokenExpired(currentToken)) {
    return currentToken;
  }

  // Call refresh endpoint
  try {
    // const response = await fetch('/api/auth/refresh', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${currentToken}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    //
    // if (response.ok) {
    //   const { token } = await response.json();
    //   return token;
    // }

    // For now, return the same token to indicate refresh failed
    return currentToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return currentToken;
  }
};

// Function to clear all auth-related data
export const clearAuthData = (): void => {
  // Clear any stored tokens or session data
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-session');
  }
};