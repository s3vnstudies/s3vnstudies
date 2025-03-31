import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Send, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ChatRoom as ChatRoomType, ChatMessage } from "@shared/schema";

interface ChatRoomProps {
  room?: ChatRoomType;
  onRoomChange: (roomId: number) => void;
  rooms: ChatRoomType[];
}

const createRoomSchema = z.object({
  name: z.string().min(3, { message: "Room name must be at least 3 characters" }),
  description: z.string().optional(),
  isPrivate: z.boolean().default(false)
});

const ChatRoom: React.FC<ChatRoomProps> = ({ room, onRoomChange, rooms }) => {
  const { user } = useAuth();
  const { messages, sendMessage, createRoom, loading } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [createRoomOpen, setCreateRoomOpen] = useState(false);

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;
    
    sendMessage(room.id, newMessage);
    setNewMessage("");
  };

  const handleCreateRoom = async (values: z.infer<typeof createRoomSchema>) => {
    try {
      const newRoom = await createRoom(values);
      toast({
        title: "Room created!",
        description: `The room "${values.name}" has been created.`,
      });
      setCreateRoomOpen(false);
      form.reset();
      onRoomChange(newRoom.id);
    } catch (error) {
      toast({
        title: "Failed to create room",
        description: "There was an error creating the room. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p>Please log in to access the chat rooms.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[700px] border rounded-lg overflow-hidden">
      {/* Rooms sidebar */}
      <div className="w-full md:w-64 bg-gray-100 border-r p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Chat Rooms</h3>
          <Dialog open={createRoomOpen} onOpenChange={setCreateRoomOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chat Room</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateRoom)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the room's purpose" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Private Room</FormLabel>
                          <p className="text-sm text-gray-500">Limit access to specific members</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateRoomOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      Create Room
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-1">
          {rooms.length === 0 ? (
            <p className="text-sm text-gray-500">No rooms available. Create one to get started!</p>
          ) : (
            rooms.map((r) => (
              <Button
                key={r.id}
                variant={room?.id === r.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => onRoomChange(r.id)}
              >
                <div className="truncate">
                  {r.name}
                  {r.isPrivate && <span className="ml-2 text-xs">🔒</span>}
                </div>
              </Button>
            ))
          )}
        </div>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {room ? (
          <>
            {/* Room header */}
            <div className="border-b p-4 bg-white">
              <h2 className="font-bold">{room.name}</h2>
              {room.description && (
                <p className="text-sm text-gray-500">{room.description}</p>
              )}
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full text-gray-500">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message: ChatMessage) => (
                    <div 
                      key={message.id}
                      className={`flex gap-2 ${message.userId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.userId !== user.id && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {message.userId.toString().substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.userId === user.id 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.userId === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>
            
            {/* Message input */}
            <form onSubmit={handleSubmit} className="border-t p-4 bg-white">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Select a room or create a new one to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
