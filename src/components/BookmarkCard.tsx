// BookmarkCard.tsx
// Displays a single bookmark with title, URL, summary, tags, and actions (open, delete, drag handle).

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Trash2, Globe, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import {
  useSortable,
} from '@dnd-kit/sortable';
import {
  CSS,
} from '@dnd-kit/utilities';

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

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

/**
 * BookmarkCard displays a single bookmark's details and actions.
 * - Shows title, URL, summary, tags, and creation date.
 * - Allows opening the link, deleting the bookmark, and supports drag-and-drop.
 */
const BookmarkCard: React.FC<BookmarkCardProps> = ({ bookmark, onDelete }) => {
  // DnD-kit hook for drag-and-drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: bookmark.id });

  // Style for drag-and-drop transform/transition
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Opens the bookmark URL in a new tab
  const handleOpenLink = () => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer');
  };

  // Returns the favicon URL for the bookmark, or null if not available
  const getFaviconUrl = () => {
    if (bookmark.favicon_url) return bookmark.favicon_url;
    try {
      const url = new URL(bookmark.url);
      return `${url.protocol}//${url.hostname}/favicon.ico`;
    } catch {
      return null;
    }
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      className={`glass-card group hover:shadow-glow/20 transition-all duration-300 ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Drag handle */}
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            {/* Favicon or globe icon */}
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted dark:bg-muted-foreground/20 flex items-center justify-center">
              {getFaviconUrl() ? (
                <img
                  src={getFaviconUrl()!}
                  alt=""
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                    if (nextElement) nextElement.style.display = 'flex';
                  }}
                />
              ) : null}
              <Globe className="w-4 h-4 text-muted-foreground" style={{ display: getFaviconUrl() ? 'none' : 'flex' }} />
            </div>
            {/* Title and hostname */}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {bookmark.title}
              </CardTitle>
              <CardDescription className="text-sm mt-1 truncate">
                {new URL(bookmark.url).hostname}
              </CardDescription>
            </div>
          </div>
          {/* Actions: open link, delete */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenLink}
              className="h-8 w-8 p-0 hover:bg-primary/20"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bookmark.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Summary */}
      {bookmark.summary && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {bookmark.summary}
          </p>
        </CardContent>
      )}
      
      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{bookmark.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      )}
      
      {/* Creation date */}
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">
          Saved {format(new Date(bookmark.created_at), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
};

export default BookmarkCard;