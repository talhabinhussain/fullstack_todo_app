"use client";

import { useAuth } from "@/components/AuthContextProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  X,
  Home,
  ListTodo,
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
} from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setOpen(false);
  };

  const navItems = [
    ...(user
      ? [
          { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { href: "/tasks", label: "Tasks", icon: ListTodo },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-black transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-gray-600 group-hover:to-black">
            Todo App
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-colors"
              >
                <span className="relative z-10 flex items-center gap-2 transition-colors group-hover:text-black">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </span>
                {/* Hover underline effect */}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.email}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="group relative overflow-hidden border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  Logout
                </span>
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group relative text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  Login
                </Link>
              </Button>
              <Button
                size="sm"
                asChild
                className="group relative overflow-hidden bg-black text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
              >
                <Link href="/signup" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="relative md:hidden transition-all duration-300 hover:bg-gray-100"
            >
              <div className="relative h-5 w-5">
                <Menu
                  className={`absolute h-5 w-5 transition-all duration-300 ${
                    open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                  }`}
                />
                <X
                  className={`absolute h-5 w-5 transition-all duration-300 ${
                    open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                  }`}
                />
              </div>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>

          {/* Mobile Menu Content */}
          <SheetContent
            side="right"
            className="w-[280px] sm:w-[320px] border-l border-gray-200 bg-white p-0"
          >
            <div className="flex h-full flex-col">
              {/* Mobile Header */}
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                    <ListTodo className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">Todo App</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-black hover:text-white"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: open
                            ? "slideInRight 0.3s ease-out forwards"
                            : "none",
                        }}
                      >
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        <span>{item.label}</span>
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-gray-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                {user && <div className="my-6 border-t border-gray-200" />}

                {/* Auth Buttons */}
                <div className="space-y-2">
                  {user ? (
                    <>
                      {/* User Info Card */}
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-300 hover:bg-gray-100">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Signed in as
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>

                      {/* Logout Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="group w-full justify-start gap-3 border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
                      >
                        <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="group w-full justify-start gap-3 border-gray-300 bg-white text-gray-700 transition-all duration-300 hover:border-black hover:bg-gray-100 hover:text-black"
                      >
                        <Link href="/login" onClick={() => setOpen(false)}>
                          <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          Login
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        asChild
                        className="group w-full justify-start gap-3 bg-black text-white transition-all duration-300 hover:bg-gray-800 hover:shadow-lg"
                      >
                        <Link href="/signup" onClick={() => setOpen(false)}>
                          <UserPlus className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>

              {/* Footer */}
              <div className="border-t border-gray-200 px-6 py-4">
                <p className="text-xs text-gray-500 text-center">
                  © 2026 Todo App. All rights reserved.
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Add keyframe animation */}
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}
