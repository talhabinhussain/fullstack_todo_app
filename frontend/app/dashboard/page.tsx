'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthContextProvider';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <ProtectedRoute fallback={<div>Loading dashboard...</div>}>
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.email}!</h2>
            <p className="text-gray-600 mb-6">You are successfully logged in to your todo application.</p>

            <div className="flex space-x-4">
              <Button onClick={() => router.push('/')}>Go Home</Button>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Tasks Overview</h3>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium mb-2">Account Settings</h3>
              <p className="text-gray-600">Update your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}