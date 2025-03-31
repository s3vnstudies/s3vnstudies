import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BulletinPost as BulletinPostType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, PinIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

interface BulletinPostWithUser extends BulletinPostType {
  user?: {
    username: string;
    fullName?: string;
    avatar?: string;
    membershipTier: string;
  };
}

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
});

export default function BulletinBoard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  const { data: posts, isLoading } = useQuery<BulletinPostWithUser[]>({
    queryKey: ["/api/bulletin"],
    queryFn: async ({ queryKey }) => {
      const response = await fetch(queryKey[0] as string);
      if (!response.ok) {
        throw new Error("Failed to fetch bulletin posts");
      }
      
      const posts = await response.json();
      
      // In a real app, user info would be included in the API response
      // Here we simulate it based on the userId
      const postsWithUsers = posts.map((post: BulletinPostType) => {
        // This is a workaround since we don't have a real user API endpoint
        const userData = {
          username: post.userId === 1 ? "JohnS" : 
                   post.userId === 2 ? "AmandaR" : "MikeT",
          fullName: post.userId === 1 ? "John Smith" : 
                   post.userId === 2 ? "Amanda Rodriguez" : "Michael Thomas",
          avatar: "",
          membershipTier: post.userId === 2 ? "vip" : "pro"
        };
        
        return { ...post, user: userData };
      });
      
      return postsWithUsers;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await apiRequest("POST", "/api/bulletin", {
        ...data,
        isPinned: false,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      toast({
        title: "Post created",
        description: "Your post has been published to the bulletin board.",
      });
      form.reset();
      setShowForm(false);
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createPostMutation.mutate(data);
  };

  const categories = [
    "Announcements",
    "General Discussion",
    "Questions",
    "Resources",
    "Events",
    "Other",
  ];

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Bulletin Board</CardTitle>
          <CardDescription>
            Join the community to participate in discussions and post on the bulletin board.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">
            Please <a href="/auth" className="text-primary hover:underline">log in</a> to view and post on the bulletin board.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Community Bulletin Board</CardTitle>
        <CardDescription>
          Share announcements, questions, and resources with the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <Button 
            className="w-full mb-6" 
            onClick={() => setShowForm(true)}
          >
            Create New Post
          </Button>
        ) : (
          <Card className="mb-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Share your thoughts, questions, or resources..." 
                            className="h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createPostMutation.isPending}
                    >
                      {createPostMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Post
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-neutral-500">Loading bulletin posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post.id} className={post.isPinned ? "border-primary/30 bg-primary/5" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                      <Avatar>
                        <AvatarImage src={post.user?.avatar} />
                        <AvatarFallback className={
                          post.user?.membershipTier === "vip" 
                            ? "bg-accent text-white" 
                            : "bg-primary text-white"
                        }>
                          {post.user?.username.substring(0, 2).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">{post.title}</h3>
                          {post.isPinned && (
                            <PinIcon className="h-4 w-4 ml-2 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center text-sm text-neutral-500">
                          <span className="font-medium text-neutral-700">
                            {post.user?.username || "Anonymous"}
                          </span>
                          <span className="mx-1">•</span>
                          <span>
                            {format(new Date(post.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                          <span className="mx-1">•</span>
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{post.content}</p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <div className="text-sm text-neutral-500">
                    {post.user?.membershipTier === "vip" 
                      ? "VIP Member" 
                      : post.user?.membershipTier === "pro"
                        ? "Pro Member"
                        : "Member"}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                    <Button variant="ghost" size="sm">
                      Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-neutral-500">No bulletin posts yet. Be the first to create one!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
