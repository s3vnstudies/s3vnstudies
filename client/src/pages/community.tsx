import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/layouts/MainLayout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ChatRoom from "@/components/ChatRoom";
import { BulletinPost, ChatRoom as ChatRoomType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Loader2, Users, Calendar, MessageSquare, Plus } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch chat rooms
  const { 
    data: chatRooms = [], 
    isLoading: isLoadingRooms 
  } = useQuery<ChatRoomType[]>({
    queryKey: ["/api/chat/rooms"],
    enabled: !!user,
  });

  // Fetch chat messages for active room
  const {
    data: chatMessages = [],
    isLoading: isLoadingMessages,
  } = useQuery({
    queryKey: ["/api/chat/rooms", activeRoomId, "messages"],
    enabled: !!activeRoomId && !!user,
  });

  // Fetch bulletin posts
  const {
    data: bulletinPosts = [],
    isLoading: isLoadingPosts,
  } = useQuery<BulletinPost[]>({
    queryKey: ["/api/bulletin"],
  });

  // Set first room as active when rooms are loaded
  useEffect(() => {
    if (chatRooms.length > 0 && !activeRoomId) {
      setActiveRoomId(chatRooms[0].id);
    }
  }, [chatRooms, activeRoomId]);

  // Handle sending chat message
  const handleSendMessage = async (message: string) => {
    if (!activeRoomId || !user) return;

    try {
      await apiRequest("POST", "/api/chat/rooms/" + activeRoomId + "/messages", {
        roomId: activeRoomId,
        message,
      });
      
      // Invalidate the messages query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms", activeRoomId, "messages"] });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Handle creating a new room
  const handleCreateRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user) return;
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const response = await apiRequest("POST", "/api/chat/rooms", {
        name,
        description,
        isPrivate: false,
      });
      
      const newRoom = await response.json();
      
      // Invalidate the rooms query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/chat/rooms"] });
      
      // Select the new room
      setActiveRoomId(newRoom.id);
      
      // Close the dialog
      setCreateRoomOpen(false);
      
      toast({
        title: "Room Created",
        description: `Your new room "${name}" has been created`,
      });
    } catch (error) {
      toast({
        title: "Failed to create room",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  // Handle creating a new bulletin post
  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!user) return;
    
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      await apiRequest("POST", "/api/bulletin", {
        title,
        content,
      });
      
      // Invalidate the posts query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/bulletin"] });
      
      // Close the dialog
      setCreatePostOpen(false);
      
      toast({
        title: "Post Created",
        description: "Your bulletin post has been published",
      });
    } catch (error) {
      toast({
        title: "Failed to create post",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const activeRoom = chatRooms.find(room => room.id === activeRoomId);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-6">
            Community Hub
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Connect with like-minded individuals, participate in discussions, and grow together in our thriving community.
          </p>
          {!user && (
            <div className="mt-8">
              <Link href="/auth">
                <Button className="bg-white text-primary font-medium hover:bg-white/90">
                  Sign In to Join the Community
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Community Content */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="chat" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
              <TabsList className="bg-white">
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Rooms
                </TabsTrigger>
                <TabsTrigger value="bulletin" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Bulletin Board
                </TabsTrigger>
                <TabsTrigger value="events" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Users className="h-4 w-4 mr-2" />
                  Events
                </TabsTrigger>
              </TabsList>
              
              {/* Conditional Create buttons */}
              {user && activeTab === "chat" && (
                <Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new chat room</DialogTitle>
                      <DialogDescription>
                        Add a new room for a specific topic or interest.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Room Name</Label>
                        <Input id="name" name="name" placeholder="E.g., Photography Tips" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          placeholder="What will this room be about?" 
                          rows={3} 
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCreateRoomOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Create Room
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
              
              {user && activeTab === "bulletin" && (
                <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a bulletin post</DialogTitle>
                      <DialogDescription>
                        Share an announcement, news, or update with the community.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreatePost} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input id="title" name="title" placeholder="Title of your post" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea 
                          id="content" 
                          name="content" 
                          placeholder="Write your post content here..." 
                          rows={5} 
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCreatePostOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                          Publish Post
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {/* Chat Rooms Tab Content */}
            <TabsContent value="chat" className="space-y-6">
              {!user ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Join the conversation</CardTitle>
                    <CardDescription>
                      Sign in to participate in chat rooms and connect with our community.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/auth">
                      <Button className="bg-gradient-to-r from-primary to-secondary">
                        Sign In to Join
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : isLoadingRooms ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Room List Sidebar */}
                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Chat Rooms</CardTitle>
                        <CardDescription>
                          Select a room to join the conversation
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {chatRooms.map((room) => (
                            <Button
                              key={room.id}
                              variant={activeRoomId === room.id ? "default" : "outline"}
                              className={`w-full justify-start ${
                                activeRoomId === room.id 
                                  ? "bg-primary text-white" 
                                  : ""
                              }`}
                              onClick={() => setActiveRoomId(room.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {room.name}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Chat Room Display */}
                  <div className="lg:col-span-9">
                    {activeRoom ? (
                      <ChatRoom
                        room={activeRoom}
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoadingMessages}
                      />
                    ) : (
                      <Card>
                        <CardContent className="p-6">
                          <div className="text-center py-10">
                            <p className="text-slate-500">Select a room to start chatting</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Bulletin Board Tab Content */}
            <TabsContent value="bulletin">
              {isLoadingPosts ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : bulletinPosts.length === 0 ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-10">
                      <p className="text-slate-500">No bulletin posts yet</p>
                      {user && (
                        <Button 
                          className="mt-4 bg-gradient-to-r from-primary to-secondary"
                          onClick={() => setCreatePostOpen(true)}
                        >
                          Create First Post
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {bulletinPosts.map((post) => (
                    <Card key={post.id} className={post.pinned ? "border-primary" : ""}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center">
                              {post.title}
                              {post.pinned && (
                                <span className="ml-2 text-xs bg-primary text-white px-2 py-1 rounded">
                                  Pinned
                                </span>
                              )}
                            </CardTitle>
                            <CardDescription>
                              Posted by {post.author?.username || "Unknown"} • {formatDate(post.createdAt)}
                            </CardDescription>
                          </div>
                          {post.author?.role === "admin" && (
                            <span className="bg-accent text-white text-xs px-2 py-1 rounded">
                              Admin
                            </span>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-slate max-w-none">
                          <p>{post.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Events Tab Content */}
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Join us for these upcoming community events and workshops
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Live Q&A Session: Content Creation</h3>
                          <p className="text-slate-600 mb-2">
                            Join our monthly Q&A session where we answer your questions about content creation strategies.
                          </p>
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            June 15, 2023 • 2:00 PM EST
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary whitespace-nowrap">
                          RSVP Now
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Community Workshop: Video Editing</h3>
                          <p className="text-slate-600 mb-2">
                            Learn advanced video editing techniques in this hands-on workshop with industry professionals.
                          </p>
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            June 22, 2023 • 1:00 PM EST
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2">
                          <span className="text-xs bg-accent text-white px-2 py-1 rounded">
                            Premium Members Only
                          </span>
                          <Button className="bg-gradient-to-r from-primary to-secondary whitespace-nowrap">
                            RSVP Now
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">Virtual Meetup: Community Showcase</h3>
                          <p className="text-slate-600 mb-2">
                            Join us for our monthly community showcase where members share their projects and get feedback.
                          </p>
                          <div className="flex items-center text-sm text-slate-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            June 30, 2023 • 3:00 PM EST
                          </div>
                        </div>
                        <Button className="bg-gradient-to-r from-primary to-secondary whitespace-nowrap">
                          RSVP Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      
      {/* Community Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Community Features</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Discover the benefits of being a part of our vibrant community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-6 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Topic-Based Chat Rooms</h3>
                <p className="text-slate-600">
                  Join conversations on specific topics or create your own room to discuss your interests.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-6 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Events & Workshops</h3>
                <p className="text-slate-600">
                  Participate in scheduled events, interactive workshops, and Q&A sessions with experts.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 mb-6 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Member Profiles</h3>
                <p className="text-slate-600">
                  Create your profile, showcase your work, and connect with other community members.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 flex justify-center">
            {!user ? (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Join Our Community
                </Button>
              </Link>
            ) : (
              <Link href="/profile">
                <Button className="bg-gradient-to-r from-primary to-secondary">
                  Update Your Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Community Guidelines Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-poppins font-bold mb-6">Community Guidelines</h2>
            <div className="prose prose-slate max-w-none">
              <p>
                Our community is built on respect, collaboration, and learning. To ensure a positive
                experience for everyone, please follow these guidelines:
              </p>
              <ul>
                <li>Be respectful and considerate to all members</li>
                <li>No harassment, hate speech, or inappropriate content</li>
                <li>Share knowledge and help others when you can</li>
                <li>Respect the privacy of other community members</li>
                <li>Follow the specific rules of each chat room</li>
                <li>Give constructive feedback and be open to receiving it</li>
              </ul>
              <p>
                Failure to follow these guidelines may result in warnings or, in serious cases,
                removal from the community. Let's work together to create a supportive and
                engaging environment for everyone!
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
