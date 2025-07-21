// ThemeContext.tsx
// Provides theme (light/dark/system) state and logic to the app using next-themes.

import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

// Create the ThemeContext
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * useTheme is a custom hook to access theme state and actions.
 * Throws an error if used outside of ThemeProvider.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider wraps the app and provides theme switching (light/dark/system) using next-themes.
 * - Sets default theme to dark.
 * - Enables system theme detection.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
};