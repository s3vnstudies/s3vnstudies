import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage, User } from "@/lib/types";
import { formatDate, getInitials, getMessageStyle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send } from "lucide-react";

interface ChatRoomProps {
  roomId: number;
  roomName: string;
  description?: string;
}

export default function ChatRoom({ roomId, roomName, description }: ChatRoomProps) {
  const { user } = useAuth();
  const { messages, sendMessage, joinRoom, leaveRoom, isConnected, isConnecting, error } = useChat();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Join the chat room when component mounts
  useEffect(() => {
    if (user) {
      joinRoom(roomId);
    }
    
    // Leave room when component unmounts
    return () => {
      leaveRoom();
    };
  }, [roomId, user, joinRoom, leaveRoom]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when connected
  useEffect(() => {
    if (isConnected && !isConnecting) {
      inputRef.current?.focus();
    }
  }, [isConnected, isConnecting]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && isConnected) {
      sendMessage(messageText.trim());
      setMessageText("");
    }
  };

  // Display messages by grouping consecutive messages from the same sender
  const renderMessages = () => {
    if (!messages.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500">No messages yet. Be the first to say something!</p>
        </div>
      );
    }

    return messages.map((message, index) => {
      const isCurrentUser = message.userId === user?.id;
      const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;
      
      return (
        <div 
          key={message.id} 
          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
          {!isCurrentUser && showAvatar && (
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={message.user?.avatar} alt={message.user?.username} />
              <AvatarFallback className="bg-primary text-white text-xs">
                {message.user?.username ? getInitials(message.user.username) : "?"}
              </AvatarFallback>
            </Avatar>
          )}
          <div className={isCurrentUser ? 'max-w-[75%]' : 'max-w-[75%] ml-10'}>
            {showAvatar && (
              <div className={`text-xs mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                {message.user?.username || "Unknown"} • {formatDate(message.createdAt, { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
            <div 
              className={`p-3 rounded-lg ${getMessageStyle(isCurrentUser)}`}
            >
              {message.message}
            </div>
          </div>
        </div>
      );
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => joinRoom(roomId)}>Reconnect</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold">{roomName}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <ScrollArea className="flex-1 p-4">
        {isConnecting ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-500">Connecting to chat...</p>
          </div>
        ) : (
          renderMessages()
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={!isConnected || isConnecting}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!messageText.trim() || !isConnected || isConnecting}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
