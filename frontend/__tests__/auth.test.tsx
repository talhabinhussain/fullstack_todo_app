import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../app/login/page';

// Mock the better-auth-react hooks
vi.mock('better-auth-react', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    session: null,
    isPending: false,
  }),
}));

describe('Authentication Flow', () => {
  it('renders login form correctly', () => {
    render(<LoginPage />);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();

    // Check for signup link
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
  });

  it('allows user to enter credentials', () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows error message for invalid credentials', async () => {
    // Mock the signIn function to return an error
    const mockSignIn = vi.fn().mockResolvedValue({ error: 'Invalid credentials' });
    vi.mock('better-auth-react', () => ({
      useAuth: () => ({
        signIn: mockSignIn,
        session: null,
        isPending: false,
      }),
    }));

    render(<LoginPage />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });
});