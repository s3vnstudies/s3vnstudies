import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  PlusCircle, 
  Calendar, 
  User as UserIcon,
  PinIcon,
  Search
} from "lucide-react";
import { BulletinPost } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Extended type to include author information
interface BulletinPostWithAuthor extends BulletinPost {
  authorName: string;
}

export default function BulletinPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: bulletinPosts, isLoading } = useQuery<BulletinPostWithAuthor[]>({
    queryKey: ["/api/bulletin"],
  });
  
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      return await apiRequest("POST", "/api/bulletin", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      toast({
        title: "Post created",
        description: "Your bulletin post has been published",
      });
      setIsCreatingPost(false);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleCreatePost = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to create a post",
        variant: "destructive",
      });
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your post",
        variant: "destructive",
      });
      return;
    }
    
    createPostMutation.mutate({
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      category: newPostCategory.trim() || undefined,
      isPinned: false // Only admins can pin posts
    });
  };
  
  // Filter posts based on search and active tab
  const filteredPosts = bulletinPosts?.filter(post => {
    // Search filter
    const matchesSearch = 
      !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Tab filter
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "announcements") return matchesSearch && post.isPinned;
    if (activeTab === "mine") return matchesSearch && post.authorId === user?.id;
    
    return matchesSearch;
  });
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Bulletin Hero */}
        <section className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-16 relative">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Community Bulletin Board</h1>
              <p className="text-lg md:text-xl opacity-90">
                Stay updated with the latest announcements, community events, and discussions.
              </p>
            </div>
          </div>
        </section>
        
        {/* Bulletin Content */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h2 className="font-heading text-2xl font-bold">Bulletin Posts</h2>
                <p className="text-neutral-600">News, announcements, and discussions from our community</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                </div>
                
                <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="h-4 w-4 mr-2" /> Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>Create a New Post</DialogTitle>
                      <DialogDescription>
                        Share an announcement, idea, or start a discussion with the community.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          placeholder="Enter a descriptive title"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category (optional)</Label>
                        <Input
                          id="category"
                          value={newPostCategory}
                          onChange={(e) => setNewPostCategory(e.target.value)}
                          placeholder="E.g., Announcement, Question, Event"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Write your post content here..."
                          className="mt-1 min-h-[150px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreatingPost(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreatePost}
                        disabled={createPostMutation.isPending}
                      >
                        {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                <TabsTrigger value="announcements">Announcements</TabsTrigger>
                {user && (
                  <TabsTrigger value="mine">My Posts</TabsTrigger>
                )}
              </TabsList>
            </Tabs>
            
            {isLoading ? (
              <div className="space-y-6">
                {Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-1/3 h-6 bg-neutral-200 rounded"></div>
                        <div className="w-20 h-5 bg-neutral-200 rounded"></div>
                      </div>
                      <div className="w-1/2 h-4 bg-neutral-200 rounded mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full h-16 bg-neutral-200 rounded"></div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex justify-between w-full">
                        <div className="w-24 h-4 bg-neutral-200 rounded"></div>
                        <div className="w-24 h-4 bg-neutral-200 rounded"></div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : !filteredPosts || filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium mb-1">No bulletin posts found</h3>
                <p className="text-neutral-500 mb-6">
                  {searchQuery 
                    ? "Try adjusting your search to find what you're looking for." 
                    : activeTab === "mine" 
                      ? "You haven't created any posts yet." 
                      : "The bulletin board is empty. Be the first to post!"}
                </p>
                {searchQuery ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button onClick={() => setIsCreatingPost(true)}>
                    Create First Post
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className={post.isPinned ? "border-primary" : undefined}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex items-center">
                          {post.title}
                          {post.isPinned && (
                            <PinIcon className="h-4 w-4 ml-2 text-primary" title="Pinned" />
                          )}
                        </CardTitle>
                        {post.category && (
                          <Badge variant="outline" className="ml-2">
                            {post.category}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-line">{post.content}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="flex items-center text-sm text-neutral-500">
                        <UserIcon className="h-3.5 w-3.5 mr-1.5" />
                        <span>Posted by {post.authorName}</span>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
