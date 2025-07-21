// Index page: Main dashboard for authenticated users
// Shows header, add bookmark form, and bookmark grid
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Header from '@/components/Header';
import AddBookmarkForm from '@/components/AddBookmarkForm';
import BookmarkGrid from '@/components/BookmarkGrid';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Get user and loading state from authentication context
  const { user, loading } = useAuth();
  // Used to trigger refresh of bookmarks after adding a new one
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Called when a new bookmark is added to refresh the grid
  const handleBookmarkAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, redirect to authentication page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Main dashboard UI for logged-in users
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="max-w-2xl mx-auto">
          <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <BookmarkGrid refreshTrigger={refreshTrigger} />
        </div>
      </main>
    </div>
  );
};

export default Index;