'use client';

import { useAuth } from 'better-auth-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestAuthPage() {
  const { signIn, signOut, session, isPending } = useAuth();

  const handleSignIn = async () => {
    // For testing, we'll simulate a sign in
    // In a real app, this would use proper credentials
    try {
      await signIn('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirectTo: '/dashboard',
      });
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test Page</CardTitle>
            <CardDescription>Test the authentication flow and state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium">Session Status:</h3>
                <p>Status: {isPending ? 'Loading...' : session ? 'Authenticated' : 'Not authenticated'}</p>
                {session && (
                  <>
                    <p>Email: {session.user?.email}</p>
                    <p>User ID: {session.user?.id}</p>
                  </>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={handleSignIn}
                  disabled={!!session}
                >
                  {session ? 'Already Signed In' : 'Test Sign In'}
                </Button>

                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  disabled={!session}
                >
                  {session ? 'Sign Out' : 'Not Signed In'}
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-2">Next Steps:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verify that login/logout works correctly</li>
                  <li>Check that protected routes redirect appropriately</li>
                  <li>Test API calls with authentication headers</li>
                  <li>Verify JWT token handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}