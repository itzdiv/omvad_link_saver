// App.tsx
// Main entry point for the Curator AI app's component tree and routing.
// Sets up global providers (React Query, Auth, Tooltip) and defines the main routes.
// made by Divyansh

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Create a React Query client for data fetching and caching
const queryClient = new QueryClient();

/**
 * The App component wraps the entire application with global providers:
 * - QueryClientProvider: Enables React Query for data fetching and caching.
 * - AuthProvider: Manages user authentication state and logic.
 * - TooltipProvider: Enables tooltips throughout the app.
 * It also sets up the main routes for the app using React Router.
 */
const App = () => (
  // Provide React Query, Auth, and Tooltip context to the whole app
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        {/* Toast notifications for user feedback */}
        <Toaster />
        <Sonner />
        {/* App routing: main page, auth page, and 404 fallback */}
        <BrowserRouter>
          <Routes>
            {/* Home/dashboard page for logged-in users */}
            <Route path="/" element={<Index />} />
            {/* Authentication page (sign in/up) */}
            <Route path="/auth" element={<Auth />} />
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
