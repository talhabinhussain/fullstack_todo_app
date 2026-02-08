"use client";

import { useAuth } from "@/components/AuthContextProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    setOpen(false);
  };

  const NavLinks = () => (
    <>
      {user && (
        <>
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/tasks"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setOpen(false)}
          >
            Tasks
          </Link>
        </>
      )}
    </>
  );

  const AuthButtons = () => (
    <>
      {user ? (
        <>
          <div className="hidden sm:block text-sm text-muted-foreground">
            {user?.email}
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Logout
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup" onClick={() => setOpen(false)}>
              Sign Up
            </Link>
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            Todo App
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4">
              {/* Mobile Navigation Links */}
              <div className="flex flex-col gap-3 mt-8">
                <NavLinks />
              </div>

              {/* Divider */}
              {user && <div className="border-t my-4" />}

              {/* Mobile Auth Section */}
              <div className="flex flex-col gap-3">
                <AuthButtons />
              </div>

              {/* User Email (Mobile) */}
              {user && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-medium mt-1">{user?.email}</p>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
