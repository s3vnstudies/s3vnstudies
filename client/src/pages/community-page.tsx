import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import PageLayout from "@/components/layout/page-layout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Plus,
  MessageSquare,
  UserCircle,
  Clock,
  Pin,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BulletinPost, ChatRoom } from "@shared/schema";

const bulletinPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
});

const chatRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  membershipRequired: z.enum(["free", "pro", "vip"]),
  isPrivate: z.boolean().default(false),
});

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("bulletin");
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const { toast } = useToast();

  // Set page title
  useEffect(() => {
    document.title = "Community - S3vn Studies";
  }, []);

  // Fetch bulletin posts
  const {
    data: bulletinPosts,
    isLoading: isLoadingPosts,
    isError: isPostsError,
  } = useQuery<BulletinPost[]>({
    queryKey: ["/api/bulletin"],
  });

  // Fetch chat rooms
  const {
    data: chatRooms,
    isLoading: isLoadingRooms,
    isError: isRoomsError,
  } = useQuery<ChatRoom[]>({
    queryKey: ["/api/chat/rooms"],
    enabled: !!user,
  });

  // Bulletin post form
  const postForm = useForm<z.infer<typeof bulletinPostSchema>>({
    resolver: zodResolver(bulletinPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
    },
  });

  // Chat room form
  const roomForm = useForm<z.infer<typeof chatRoomSchema>>({
    resolver: zodResolver(chatRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      membershipRequired: "free",
      isPrivate: false,
    },
  });

  // Submit bulletin post
  const onSubmitPost = async (values: z.infer<typeof bulletinPostSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to post on the bulletin board",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/bulletin", values);
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      
      toast({
        title: "Post created",
        description: "Your bulletin post has been published",
      });
      
      postForm.reset();
      setIsPostDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Submit chat room
  const onSubmitRoom = async (values: z.infer<typeof chatRoomSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a chat room",
        variant: "destructive",
      });
      return;
    }

    // Check if user has required membership to create a room
    if (user.membershipTier === "free") {
      toast({
        title: "Pro or VIP membership required",
        description: "Please upgrade your membership to create chat rooms",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest("POST", "/api/chat/rooms", values);
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms"] });
      
      toast({
        title: "Chat room created",
        description: "Your chat room has been created successfully",
      });
      
      roomForm.reset();
      setIsRoomDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create chat room",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Delete bulletin post
  const deletePost = async (id: number) => {
    if (!user) return;

    try {
      await apiRequest("DELETE", `/api/bulletin/${id}`);
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      
      toast({
        title: "Post deleted",
        description: "Your bulletin post has been deleted",
      });
    } catch (error) {
      toast({
        title: "Failed to delete post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="flex items-center mb-4">
            <Users className="h-8 w-8 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold font-poppins">Community</h1>
          </div>
          <p className="text-lg opacity-90 max-w-2xl">
            Connect with other members, participate in discussions, and share your ideas with the S3vn Studies community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="bulletin">Bulletin Board</TabsTrigger>
              <TabsTrigger value="chat">Chat Rooms</TabsTrigger>
            </TabsList>

            {activeTab === "bulletin" ? (
              <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="h-4 w-4 mr-2" /> New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Bulletin Post</DialogTitle>
                    <DialogDescription>
                      Share your thoughts, questions, or ideas with the community
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...postForm}>
                    <form onSubmit={postForm.handleSubmit(onSubmitPost)} className="space-y-6 py-4">
                      <FormField
                        control={postForm.control}
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
                        control={postForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="General">General</SelectItem>
                                <SelectItem value="Question">Question</SelectItem>
                                <SelectItem value="Discussion">Discussion</SelectItem>
                                <SelectItem value="Announcement">Announcement</SelectItem>
                                <SelectItem value="Resource">Resource</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={postForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Share your thoughts with the community"
                                className="min-h-[150px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPostDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Post</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="h-4 w-4 mr-2" /> New Chat Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px]">
                  <DialogHeader>
                    <DialogTitle>Create New Chat Room</DialogTitle>
                    <DialogDescription>
                      Create a new chat room for the community (Pro or VIP members only)
                    </DialogDescription>
                  </DialogHeader>

                  <Form {...roomForm}>
                    <form onSubmit={roomForm.handleSubmit(onSubmitRoom)} className="space-y-6 py-4">
                      <FormField
                        control={roomForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter room name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="What will this room be about?"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roomForm.control}
                        name="membershipRequired"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Membership</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select required membership" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="free">Free (Everyone)</SelectItem>
                                <SelectItem value="pro">Pro Members</SelectItem>
                                <SelectItem value="vip">VIP Members Only</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Who can access this chat room?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsRoomDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">Create Room</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <TabsContent value="bulletin">
            {isLoadingPosts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading bulletin posts...</p>
              </div>
            ) : isPostsError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load bulletin posts</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] })}
                >
                  Retry
                </Button>
              </div>
            ) : bulletinPosts && bulletinPosts.length > 0 ? (
              <div className="space-y-6">
                {bulletinPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            <UserCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">User #{post.userId}</h3>
                            <div className="flex items-center text-xs text-neutral-500">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{formatDate(post.postedAt)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="ml-2">{post.category}</Badge>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                      <p className="text-neutral-700 whitespace-pre-line">{post.content}</p>

                      {user && user.id === post.userId && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-xl font-semibold mb-2">No Bulletin Posts Yet</h3>
                <p className="text-neutral-600 mb-6">
                  Be the first to start a conversation in our community bulletin board!
                </p>
                <Button
                  onClick={() => setIsPostDialogOpen(true)}
                  className="bg-primary hover:bg-primary-dark"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create Post
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat">
            {!user ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-xl font-semibold mb-2">Sign In to Access Chat Rooms</h3>
                <p className="text-neutral-600 mb-6">
                  Join our community to participate in chat rooms and connect with other members.
                </p>
                <Button asChild className="bg-primary hover:bg-primary-dark">
                  <Link href="/auth">Sign In</Link>
                </Button>
              </div>
            ) : isLoadingRooms ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading chat rooms...</p>
              </div>
            ) : isRoomsError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load chat rooms</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms"] })}
                >
                  Retry
                </Button>
              </div>
            ) : chatRooms && chatRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chatRooms.map((room) => (
                  <Card key={room.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{room.name}</span>
                        {room.isPrivate && <Pin className="h-4 w-4 text-amber-500" />}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <Badge
                          variant={
                            room.membershipRequired === "vip"
                              ? "default"
                              : room.membershipRequired === "pro"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs mr-2"
                        >
                          {room.membershipRequired === "free"
                            ? "Free"
                            : room.membershipRequired.toUpperCase()}
                        </Badge>
                        <span className="text-xs">Created {formatDate(room.createdAt)}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-neutral-600 mb-4">
                        {room.description || "Join this room to start chatting"}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href="/chat">Join Room</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm p-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <h3 className="text-xl font-semibold mb-2">No Chat Rooms Available</h3>
                <p className="text-neutral-600 mb-6">
                  Be the first to create a chat room for our community!
                </p>
                {user.membershipTier !== "free" ? (
                  <Button
                    onClick={() => setIsRoomDialogOpen(true)}
                    className="bg-primary hover:bg-primary-dark"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Chat Room
                  </Button>
                ) : (
                  <Button asChild className="bg-secondary hover:bg-secondary-dark">
                    <Link href="/membership">Upgrade Membership</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-16 bg-primary/5 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold font-poppins mb-4">
            Community Guidelines
          </h2>
          <p className="text-neutral-700 mb-6 max-w-3xl mx-auto">
            Our community thrives on respectful and constructive interactions. Please be courteous to other members,
            avoid offensive content, and help create a welcoming environment for everyone.
          </p>
          <Button asChild variant="outline">
            <Link href="/policies">View Full Guidelines</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
