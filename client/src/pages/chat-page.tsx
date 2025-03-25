import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useWebSocket, type ChatRoom } from "@/lib/websocket";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { 
  Loader2, 
  Send, 
  Users, 
  Plus, 
  Menu, 
  Lock, 
  MessageSquare,
  Info,
  ArrowLeft 
} from "lucide-react";

// Form schema for creating a chat room
const chatRoomSchema = z.object({
  name: z.string().min(3, { message: "Room name must be at least 3 characters" }).max(50),
  description: z.string().max(200, { message: "Description cannot exceed 200 characters" }).optional(),
  isPrivate: z.boolean().default(false),
});

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isMobileRoomsOpen, setIsMobileRoomsOpen] = useState(false);
  const [createRoomOpen, setCreateRoomOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Parse query params
  const searchParams = new URLSearchParams(window.location.search);
  const roomParam = searchParams.get("room");
  const createParam = searchParams.get("create") === "true";

  // Get websocket state and functions
  const { 
    isConnected, 
    messages, 
    rooms, 
    currentRoom, 
    joinRoom, 
    sendMessage 
  } = useWebSocket();

  // Create new room form
  const form = useForm<z.infer<typeof chatRoomSchema>>({
    resolver: zodResolver(chatRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
    },
  });

  // Create new chat room mutation
  const createChatRoomMutation = useMutation({
    mutationFn: async (values: z.infer<typeof chatRoomSchema>) => {
      const res = await apiRequest("POST", "/api/chat-rooms", values);
      return res.json();
    },
    onSuccess: (data: ChatRoom) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-rooms"] });
      toast({
        title: "Room created",
        description: `Chat room "${data.name}" has been created successfully`,
      });
      setCreateRoomOpen(false);
      form.reset();
      
      // Join the newly created room
      setSelectedRoomId(data.id);
      joinRoom(data.id);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create room",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle creating a new chat room
  const onSubmit = (values: z.infer<typeof chatRoomSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a chat room",
        variant: "destructive",
      });
      return;
    }
    
    if (user.membershipLevel === "free" && values.isPrivate) {
      toast({
        title: "Premium required",
        description: "You need a premium membership to create private chat rooms",
        variant: "destructive",
      });
      return;
    }
    
    createChatRoomMutation.mutate(values);
  };

  // Open the create room dialog if query param is present
  useEffect(() => {
    if (createParam && user) {
      setCreateRoomOpen(true);
    }
  }, [createParam, user]);

  // Set selected room from URL param
  useEffect(() => {
    if (roomParam) {
      const roomId = parseInt(roomParam);
      setSelectedRoomId(roomId);
      
      // Join the room through WebSocket
      if (isConnected) {
        joinRoom(roomId);
      }
    } else if (rooms.length > 0 && !selectedRoomId) {
      // Select first room by default
      setSelectedRoomId(rooms[0].id);
      
      // Join the room through WebSocket
      if (isConnected) {
        joinRoom(rooms[0].id);
      }
    }
  }, [roomParam, rooms, isConnected, joinRoom, selectedRoomId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!message.trim() || !selectedRoomId || !user) return;
    
    sendMessage(message, selectedRoomId, user.id);
    setMessage("");
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get user initials for avatar
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  // Format timestamp to readable format
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be logged in to access the chat rooms.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end gap-2">
            <Link href="/auth">
              <Button>Login</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-0 md:px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border min-h-[calc(100vh-8rem)]">
          <div className="flex h-full">
            {/* Chat Rooms Sidebar - Hidden on mobile */}
            <div className="hidden md:flex flex-col w-64 border-r">
              <div className="p-4 border-b">
                <h2 className="font-heading font-bold text-lg mb-2">Chat Rooms</h2>
                {user.membershipLevel !== 'free' && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setCreateRoomOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                  </Button>
                )}
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {rooms.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No chat rooms available</p>
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <button
                        key={room.id}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedRoomId === room.id
                            ? "bg-primary text-white"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedRoomId(room.id);
                          joinRoom(room.id);
                          setIsMobileRoomsOpen(false);
                        }}
                      >
                        <div className="flex items-center">
                          {room.isPrivate && (
                            <Lock className={`h-4 w-4 mr-2 ${selectedRoomId === room.id ? "text-white" : "text-muted-foreground"}`} />
                          )}
                          <div className="truncate">{room.name}</div>
                        </div>
                        <div className={`text-xs ${selectedRoomId === room.id ? "text-white/80" : "text-muted-foreground"} mt-1 truncate`}>
                          {room.description || "Join this room to start chatting"}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">
                  {user.membershipLevel === 'free' ? (
                    <>
                      <p className="mb-1">Upgrade to Premium to create your own chat rooms!</p>
                      <Link href="/profile?tab=membership">
                        <Button variant="link" className="text-primary p-0 h-auto text-xs">
                          Upgrade Now
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <p>You have Premium membership. You can create private chat rooms!</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Mobile Room Selection */}
            <Sheet open={isMobileRoomsOpen} onOpenChange={setIsMobileRoomsOpen}>
              <SheetContent side="left" className="w-[300px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Chat Rooms</SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 h-[calc(100vh-10rem)]">
                  <div className="p-2 space-y-1">
                    {rooms.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No chat rooms available</p>
                      </div>
                    ) : (
                      rooms.map((room) => (
                        <button
                          key={room.id}
                          className={`w-full text-left p-3 rounded-md transition-colors ${
                            selectedRoomId === room.id
                              ? "bg-primary text-white"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedRoomId(room.id);
                            joinRoom(room.id);
                            setIsMobileRoomsOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            {room.isPrivate && (
                              <Lock className={`h-4 w-4 mr-2 ${selectedRoomId === room.id ? "text-white" : "text-muted-foreground"}`} />
                            )}
                            <div className="truncate">{room.name}</div>
                          </div>
                          <div className={`text-xs ${selectedRoomId === room.id ? "text-white/80" : "text-muted-foreground"} mt-1 truncate`}>
                            {room.description || "Join this room to start chatting"}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t">
                  {user.membershipLevel !== 'free' && (
                    <Button 
                      variant="outline" 
                      className="w-full mb-3"
                      onClick={() => {
                        setIsMobileRoomsOpen(false);
                        setCreateRoomOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Room
                    </Button>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {user.membershipLevel === 'free' ? (
                      <>
                        <p className="mb-1">Upgrade to Premium to create your own chat rooms!</p>
                        <Link href="/profile?tab=membership">
                          <Button variant="link" className="text-primary p-0 h-auto text-xs">
                            Upgrade Now
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <p>You have Premium membership. You can create private chat rooms!</p>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2"
                    onClick={() => setIsMobileRoomsOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  
                  {currentRoom ? (
                    <div>
                      <h2 className="font-heading font-bold text-lg flex items-center">
                        {currentRoom.isPrivate && <Lock className="h-4 w-4 mr-2 text-muted-foreground" />}
                        {currentRoom.name}
                      </h2>
                      {currentRoom.description && (
                        <p className="text-sm text-muted-foreground">{currentRoom.description}</p>
                      )}
                    </div>
                  ) : selectedRoomId ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading chat room...</span>
                    </div>
                  ) : (
                    <div>
                      <h2 className="font-heading font-bold text-lg">Chat Rooms</h2>
                      <p className="text-sm text-muted-foreground">Select a room to start chatting</p>
                    </div>
                  )}
                </div>
                
                {currentRoom && (
                  <div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowUsers(!showUsers)}
                    >
                      <Users className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {!isConnected ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-2" />
                    <p>Connecting to chat server...</p>
                  </div>
                ) : !selectedRoomId ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">Welcome to Chat Rooms</h3>
                    <p className="text-center max-w-md">
                      Select a room from the sidebar to start chatting with other community members.
                    </p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Info className="h-12 w-12 mb-4 opacity-30" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-center max-w-md">
                      Be the first to start a conversation in this room!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => {
                      const isCurrentUser = msg.userId === user?.id;
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage 
                                src={msg.user?.profilePicture || ""} 
                                alt={msg.user?.username || ""} 
                              />
                              <AvatarFallback>{getUserInitials(msg.user?.username || "U")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div 
                                className={`rounded-lg p-3 ${
                                  isCurrentUser 
                                    ? 'bg-primary text-white' 
                                    : 'bg-white border shadow-sm'
                                }`}
                              >
                                <div className={`font-medium text-sm mb-1 ${isCurrentUser ? 'text-white' : ''}`}>
                                  {msg.user?.username || "Unknown User"}
                                </div>
                                <p className="text-sm break-words">{msg.content}</p>
                              </div>
                              <div 
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-right' : ''
                                } text-muted-foreground`}
                              >
                                {formatMessageTime(msg.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={!selectedRoomId || !isConnected}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !selectedRoomId || !isConnected}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Active Users Panel */}
            {showUsers && (
              <div className="hidden md:block w-64 border-l">
                <div className="p-4 border-b">
                  <h3 className="font-heading font-bold">Active Users</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src={user.profilePicture || ""} alt={user.username} />
                      <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.username} (You)</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                  </div>
                  
                  {/* Other users would be listed here in a real implementation */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson" />
                      <AvatarFallback>SJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Sarah Johnson</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Michael Roberts" />
                      <AvatarFallback>MR</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Michael Roberts</div>
                      <div className="text-xs text-muted-foreground">Online</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Chat Room Dialog */}
      <Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Chat Room</DialogTitle>
            <DialogDescription>
              Create a chat room for discussions on specific topics. Premium members can create private rooms.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a name for your room" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe what this room is about" 
                        className="resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {user.membershipLevel !== 'free' && (
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Private Room</FormLabel>
                        <FormDescription>
                          Private rooms are only visible to those who have the link
                        </FormDescription>
                      </div>
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateRoomOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createChatRoomMutation.isPending}
                >
                  {createChatRoomMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Room"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
