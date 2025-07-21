// BookmarkGrid.tsx
// Displays a searchable, filterable, and draggable grid of all bookmarks for the current user.
// Handles fetching, filtering, tag management, and drag-and-drop reordering.

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import BookmarkCard from './BookmarkCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

interface Bookmark {
  id: string;
  url: string;
  title: string;
  favicon_url: string | null;
  summary: string | null;
  tags: string[];
  created_at: string;
  position: number;
}

interface BookmarkGridProps {
  refreshTrigger: number;
}

/**
 * BookmarkGrid fetches and displays all bookmarks for the current user.
 * - Allows searching and filtering by tags.
 * - Supports drag-and-drop reordering (with persistence to the database).
 * - Shows loading and empty states.
 */
const BookmarkGrid: React.FC<BookmarkGridProps> = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set up drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch bookmarks from Supabase for the current user
  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('position', { ascending: true });

      if (error) throw error;

      // Ensure position exists for all bookmarks
      const bookmarksWithOrder = (data || []).map((bookmark, index) => ({
        ...bookmark,
        position: bookmark.position ?? index,
      }));

      setBookmarks(bookmarksWithOrder);
      
      // Extract all unique tags
      const tags = new Set<string>();
      data?.forEach(bookmark => {
        bookmark.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error: any) {
      toast({
        title: "Error loading bookmarks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookmarks when user or refreshTrigger changes
  useEffect(() => {
    fetchBookmarks();
  }, [user, refreshTrigger]);

  // Filter bookmarks by search term and selected tags
  useEffect(() => {
    let filtered = bookmarks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bookmark.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bookmark =>
        selectedTags.some(tag => bookmark.tags.includes(tag))
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, selectedTags]);

  // Delete a bookmark by id
  const handleDeleteBookmark = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Bookmark deleted",
        description: "The bookmark has been removed from your collection.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting bookmark",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Toggle a tag in the selectedTags filter
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Handle drag-and-drop reordering and persist new order to the database
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = filteredBookmarks.findIndex((item) => item.id === active.id);
      const newIndex = filteredBookmarks.findIndex((item) => item.id === over?.id);

      const newOrderedBookmarks = arrayMove(filteredBookmarks, oldIndex, newIndex);
      
      // Update local state immediately for better UX
      setFilteredBookmarks(newOrderedBookmarks);
      
      // Update position in database
      try {
        const updates = newOrderedBookmarks.map((bookmark, index) => ({
          id: bookmark.id,
          position: index,
        }));

        for (const update of updates) {
          await supabase
            .from('bookmarks')
            .update({ position: update.position })
            .eq('id', update.id)
            .eq('user_id', user?.id);
        }

        // Update the main bookmarks array to maintain consistency
        setBookmarks(prev => {
          const updated = [...prev];
          newOrderedBookmarks.forEach((bookmark, index) => {
            const bookmarkIndex = updated.findIndex(b => b.id === bookmark.id);
            if (bookmarkIndex !== -1) {
              updated[bookmarkIndex] = { ...bookmark, position: index };
            }
          });
          return updated.sort((a, b) => a.position - b.position);
        });

      } catch (error: any) {
        toast({
          title: "Error updating order",
          description: error.message,
          variant: "destructive",
        });
        // Revert on error
        setFilteredBookmarks(arrayMove(newOrderedBookmarks, newIndex, oldIndex));
      }
    }
  };

  // Show loading skeletons while bookmarks are loading
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass"
          />
        </div>

        {allTags.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Filter className="h-4 w-4" />
              Filter by tags:
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''}
          {searchTerm || selectedTags.length > 0 ? ' found' : ' total'}
        </p>
        {(searchTerm || selectedTags.length > 0) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedTags([]);
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Bookmarks Grid */}
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || selectedTags.length > 0 ? 'No bookmarks found' : 'No bookmarks yet'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedTags.length > 0
                ? 'Try adjusting your search criteria'
                : 'Start by adding your first bookmark above'
              }
            </p>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredBookmarks.map(b => b.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map(bookmark => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default BookmarkGrid;