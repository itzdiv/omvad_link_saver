// Header.tsx
// The main navigation/header bar for Curator AI. Shows app branding, user info, theme toggle, and sign out.
// made by Divyansh

import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Bookmark, Sparkles, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';

/**
 * Header component displays the app's logo, user info, and a dropdown menu
 * for profile, theme switching, and sign out. Stays at the top of the page.
 */
const Header = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // Signs the user out when called
  const handleSignOut = async () => {
    await signOut();
  };

  // Returns the first two letters of the user's email for the avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return 'U';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-glass-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* App logo and title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bookmark className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-primary-glow absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Link Saver
              </h1>
              <p className="text-xs text-muted-foreground">
                Auto-summarized bookmarks
              </p>
            </div>
          </div>

          {/* User dropdown menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-card" align="end">
                {/* User email */}
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {/* Profile option (not implemented) */}
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Theme toggle */}
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      <Sun className="mr-2 h-4 w-4 hidden" />
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4 hidden" />
                      <Sun className="mr-2 h-4 w-4" />
                    </>
                  )}
                  Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* Sign out option */}
                <DropdownMenuItem
                  className="cursor-pointer text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;