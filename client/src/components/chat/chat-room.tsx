import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { ChatRoom as ChatRoomType, ChatMessage } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  InfoIcon, 
  User as UserIcon, 
  Users, 
  Send, 
  Lock, 
  Unlock,
  UserPlus
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatRoomProps {
  roomId: number;
}

interface ChatMessageWithUser extends ChatMessage {
  username: string;
}

export default function ChatRoom({ roomId }: ChatRoomProps) {
  const { user } = useAuth();
  const { messages, sendMessage, isConnected } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch room details
  const { data: room, isLoading: isLoadingRoom } = useQuery<ChatRoomType>({
    queryKey: [`/api/chat/rooms/${roomId}`],
    queryFn: async () => {
      const response = await fetch(`/api/chat/rooms/${roomId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat room");
      }
      return response.json();
    }
  });
  
  // Fetch room messages
  const { data: roomMessages, isLoading: isLoadingMessages } = useQuery<ChatMessageWithUser[]>({
    queryKey: [`/api/chat/rooms/${roomId}/messages`],
    queryFn: async () => {
      const response = await fetch(`/api/chat/rooms/${roomId}/messages`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat messages");
      }
      return response.json();
    }
  });
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, roomMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;
    
    sendMessage(roomId, newMessage);
    setNewMessage("");
  };
  
  // Display messages from either WebSocket connection or API query
  const displayMessages = messages[roomId] || roomMessages || [];
  
  return (
    <>
      {/* Chat Header */}
      <div className="bg-white border-b border-neutral-200 p-4 flex justify-between items-center">
        {isLoadingRoom ? (
          <div className="animate-pulse flex items-center">
            <div className="h-8 w-32 bg-neutral-200 rounded"></div>
          </div>
        ) : (
          <div className="flex items-center">
            <h3 className="font-heading font-bold text-lg mr-2">{room?.name}</h3>
            {room?.isPrivate ? (
              <Lock className="h-4 w-4 text-neutral-500" title="Private Room" />
            ) : (
              <Unlock className="h-4 w-4 text-neutral-500" title="Public Room" />
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-neutral-500">
            <Users className="h-4 w-4 mr-1" /> 
            <span className="hidden md:inline">Members</span>
          </Button>
          <Button variant="ghost" size="sm" className="text-neutral-500">
            <InfoIcon className="h-4 w-4 mr-1" /> 
            <span className="hidden md:inline">Info</span>
          </Button>
          {room?.isPrivate && user?.id === room?.creatorId && (
            <Button variant="ghost" size="sm" className="text-neutral-500">
              <UserPlus className="h-4 w-4 mr-1" /> 
              <span className="hidden md:inline">Invite</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-neutral-50">
        {(isLoadingMessages && displayMessages.length === 0) ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex items-start gap-3 ${i % 2 === 0 ? '' : 'justify-end'}`}>
                {i % 2 === 0 && (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse"></div>
                )}
                <div className={`rounded-lg p-3 max-w-[85%] ${i % 2 === 0 ? 'bg-neutral-200' : 'bg-primary-light/30'} animate-pulse`}>
                  <div className="h-4 w-20 bg-neutral-300 rounded mb-2"></div>
                  <div className="h-3 w-40 bg-neutral-300 rounded"></div>
                </div>
                {i % 2 !== 0 && (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        ) : displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium mb-1">No messages yet</h3>
            <p className="text-neutral-500">Be the first to start a conversation in this room</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayMessages.map((message) => {
              const isOwnMessage = message.userId === user?.id;
              
              return (
                <div key={message.id} className={`flex items-start gap-3 ${isOwnMessage ? 'justify-end' : ''}`}>
                  {!isOwnMessage && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-neutral-200">
                        {message.username ? message.username.charAt(0).toUpperCase() : <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`${
                    isOwnMessage 
                      ? 'bg-primary-light text-white' 
                      : 'bg-neutral-100'
                  } rounded-lg p-3 max-w-[85%]`}>
                    <div className="font-medium text-sm mb-1">
                      {isOwnMessage ? 'You' : message.username}
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <div className="text-xs opacity-70 mt-1 text-right">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                  {isOwnMessage && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatarUrl || ""} alt={user?.username} />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      <div className="p-4 border-t border-neutral-200 bg-white">
        {!isConnected ? (
          <div className="text-center text-neutral-500 p-2 bg-neutral-100 rounded-md">
            Connecting to chat... If this persists, please refresh the page.
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4 mr-1" /> Send
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
