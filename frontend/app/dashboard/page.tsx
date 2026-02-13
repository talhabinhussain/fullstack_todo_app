"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContextProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  LogOut,
  Home,
  CheckSquare,
  Settings,
  TrendingUp,
  Calendar,
  Target,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const stats = [
    {
      label: "Total Tasks",
      value: "24",
      icon: CheckSquare,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Completed",
      value: "18",
      icon: Target,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "In Progress",
      value: "6",
      icon: TrendingUp,
      color: "from-orange-500 to-amber-500",
    },
    {
      label: "This Week",
      value: "12",
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
  ];

  const quickActions = [
    {
      title: "Tasks Overview",
      description: "Manage your tasks efficiently",
      icon: CheckSquare,
      gradient: "from-blue-500 to-cyan-500",
      action: () => router.push("/tasks"),
    },
    {
      title: "Account Settings",
      description: "Update your profile and preferences",
      icon: Settings,
      gradient: "from-purple-500 to-pink-500",
      action: () => router.push("/settings"),
    },
  ];

  return (
    <ProtectedRoute fallback={<div>Loading dashboard...</div>}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-slate-600">
                Welcome back, manage your tasks and productivity
              </p>
            </div>

            {/* Welcome Card */}
            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 mb-8 overflow-hidden border border-slate-100">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                      <span className="group-hover:scale-110 inline-block transition-transform duration-300">
                        👋
                      </span>
                      Welcome, {user?.email}!
                    </h2>
                    <p className="text-slate-600">
                      You are successfully logged in to your todo application.
                    </p>
                  </div>
                  <Zap className="text-yellow-500 w-6 h-6 animate-pulse" />
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Button
                    onClick={() => router.push("/")}
                    className="group/btn bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    <Home className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                    Go Home
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="group/btn border-2 hover:border-red-500 hover:text-red-500 transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 p-6 overflow-hidden border border-slate-100 cursor-pointer hover:-translate-y-1"
                >
                  {/* Gradient background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800 mb-1 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </h3>
                    <p className="text-sm text-slate-600">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.action}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-8 overflow-hidden border border-slate-100 cursor-pointer hover:-translate-y-2"
                >
                  {/* Animated gradient border effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  ></div>
                  <div className="absolute inset-[2px] bg-white rounded-xl"></div>

                  <div className="relative z-10">
                    <div
                      className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${action.gradient} mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                    >
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-slate-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {action.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{action.description}</p>
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      Learn more
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
