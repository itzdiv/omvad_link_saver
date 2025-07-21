// AddBookmarkForm.tsx
// Form component for adding a new bookmark. Handles metadata extraction, summary generation, and saving to Supabase.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, Link2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AddBookmarkFormProps {
  onBookmarkAdded: () => void;
}

/**
 * AddBookmarkForm allows the user to submit a new bookmark URL and tags.
 * - Extracts metadata (title) from the URL.
 * - Generates an AI summary for the link.
 * - Saves the bookmark to Supabase.
 * - Notifies parent to refresh bookmarks on success.
 */
const AddBookmarkForm: React.FC<AddBookmarkFormProps> = ({ onBookmarkAdded }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: '',
    tags: '',
  });

  // Extracts the title from the target URL using a CORS proxy
  const extractMetadata = async (url: string) => {
    try {
      // Try to fetch the page to extract title
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        
        // Extract title from <title> or og:title meta tag
        const title = doc.querySelector('title')?.textContent?.trim() || 
                     doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || 
                     new URL(url).hostname;
        
        return { title };
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
    
    // Fallback to hostname if extraction fails
    try {
      return { title: new URL(url).hostname };
    } catch {
      return { title: url };
    }
  };

  // Generates a summary for the URL using an external AI API
  const generateSummary = async (url: string): Promise<string | null> => {
    try {
      const target = encodeURIComponent(url);
      const response = await fetch(`https://r.jina.ai/${target}`);

      if (!response.ok) {
        console.error('Jina AI error:', response.status, response.statusText);
        return 'Summary temporarily unavailable.';
      }

      const summary = await response.text();
      // Trim the summary to a reasonable length for display
      return summary.length > 500 ? summary.substring(0, 500) + '...' : summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Summary temporarily unavailable.';
    }
  };

  // Handles form submission: validates, extracts metadata, generates summary, and saves to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.url.trim()) return;

    setIsLoading(true);
    try {
      // Validate URL
      const url = new URL(formData.url.trim());
      
      // Extract metadata and generate summary
      const [metadata, summary] = await Promise.all([
        extractMetadata(url.toString()),
        generateSummary(url.toString())
      ]);

      // Parse tags from comma-separated string
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Save to database
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          url: url.toString(),
          title: metadata.title,
          summary: summary ? summary.substring(0, 1000) : null, // Limit summary length
          tags: tags,
          favicon_url: `${url.protocol}//${url.hostname}/favicon.ico`,
        });

      if (error) throw error;

      toast({
        title: "Bookmark saved!",
        description: "Your link has been saved and summarized.",
      });

      setFormData({ url: '', tags: '' });
      onBookmarkAdded();
    } catch (error: any) {
      toast({
        title: "Error saving bookmark",
        description: error.message || "Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handles input changes for both URL and tags fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-primary" />
          <CardTitle>Add New Bookmark</CardTitle>
        </div>
        <CardDescription>
          Paste any URL to save it with an auto-generated summary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className="glass"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (optional)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="work, article, important (comma-separated)"
              value={formData.tags}
              onChange={handleInputChange}
              disabled={isLoading}
              className="glass"
            />
          </div>
          
          <Button
            type="submit"
            disabled={isLoading || !formData.url.trim()}
            className="w-full btn-primary"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving & Summarizing...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Save Bookmark
              </>
            )}
          </Button>
          
          {isLoading && (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Generating AI summary...
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default AddBookmarkForm;