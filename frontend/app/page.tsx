import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { headers } from "next/headers";
import { CheckCircle2, Shield, Zap } from "lucide-react";

export default async function HomePage() {
  let isAuthenticated = false;
  try {
    const headersList = headers();
    const cookies = headersList.get("cookie");
    if (cookies && cookies.includes("better-auth.session_token")) {
      isAuthenticated = true;
    }
  } catch (error) {
    console.error("Error checking auth status:", error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <Card className="shadow-xl border-0 overflow-hidden">
            {/* Header Section */}
            <CardHeader className="text-center bg-gradient-to-r from-gray-900 to-gray-800 text-white pb-8 pt-10">
              <CardTitle className="text-4xl sm:text-5xl font-bold mb-3">
                Todo Application
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Manage your tasks efficiently with our secure platform
              </CardDescription>
            </CardHeader>

            {/* Content Section */}
            <CardContent className="p-8 sm:p-12">
              <div className="text-center space-y-8">
                {/* Welcome Section */}
                <div className="space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Welcome to the Todo App
                  </h2>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                    A full-stack application with authentication, task
                    management, and secure data handling.
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Task Management
                    </h3>
                    <p className="text-sm text-gray-600">
                      Organize efficiently
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Secure Data</h3>
                    <p className="text-sm text-gray-600">
                      Protected & encrypted
                    </p>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      Fast & Reliable
                    </h3>
                    <p className="text-sm text-gray-600">Lightning quick</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  {!isAuthenticated ? (
                    <>
                      <Button asChild size="lg" className="text-base px-8 py-6">
                        <Link href="/login">Sign In</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-base px-8 py-6 border-2"
                      >
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  ) : (
                    <Button asChild size="lg" className="text-base px-8 py-6">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>

            {/* Footer */}
            <div className="px-8 py-6 bg-gray-50 border-t">
              <p className="text-sm text-gray-500 text-center">
                Built with{" "}
                <span className="font-semibold text-gray-700">Next.js</span>,{" "}
                <span className="font-semibold text-gray-700">FastAPI</span>,{" "}
                <span className="font-semibold text-gray-700">
                  Neon PostgreSQL
                </span>
                , and{" "}
                <span className="font-semibold text-gray-700">ShadCN UI</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
