import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BulletinPost from "./BulletinPost";
import { BulletinPost as BulletinPostType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function BulletinBoard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: posts, isLoading } = useQuery<(BulletinPostType & { username: string })[]>({
    queryKey: ["/api/bulletin"],
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: { title: string; content: string; category: string }) => {
      return apiRequest("POST", "/api/bulletin", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      toast({
        title: "Post created",
        description: "Your post has been published to the bulletin board.",
      });
      setTitle("");
      setContent("");
      setCategory("general");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Invalid submission",
        description: "Please provide both a title and content for your post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    createPostMutation.mutate(
      { title, content, category },
      {
        onSettled: () => setIsSubmitting(false),
      }
    );
  };
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="posts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Community Bulletin</TabsTrigger>
          {user && <TabsTrigger value="create">Create Post</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="posts">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-6 mt-6">
              {posts.map((post) => (
                <BulletinPost 
                  key={post.id} 
                  post={post} 
                  canDelete={user && (user.id === post.userId || user.role === "admin")}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No bulletin posts yet</p>
              {user && (
                <Button onClick={() => document.getElementById('create-tab')?.click()}>
                  Create the First Post
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {user && (
          <TabsContent value="create" id="create-tab">
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="resource">Resource</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your post here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !title.trim() || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post to Bulletin Board"
                )}
              </Button>
            </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
