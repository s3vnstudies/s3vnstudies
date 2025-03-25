import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MessageBubble from "./MessageBubble";
import { Send } from "lucide-react";
import { ChatRoom as ChatRoomType } from "@shared/schema";

interface ChatMessageWithUser {
  id: number;
  roomId: number;
  userId: number;
  message: string;
  createdAt: Date | string;
  user: {
    username: string;
    avatarUrl: string;
    role: string;
  };
}

interface ChatRoomProps {
  room: ChatRoomType;
  messages: ChatMessageWithUser[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatRoom({
  room,
  messages,
  onSendMessage,
  isLoading = false,
}: ChatRoomProps) {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && onSendMessage) {
      onSendMessage(messageText);
      setMessageText("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="p-6 bg-slate-100 flex justify-between items-center border-b">
        <h3 className="text-xl font-poppins font-semibold">{room.name}</h3>
        <div className="text-sm text-slate-500">
          {room.description}
        </div>
      </div>
      
      <div className="p-6 h-[400px] overflow-y-auto scrollbar-hide flex flex-col space-y-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            No messages yet. Start the conversation!
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            Loading messages...
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message.message}
              username={message.user.username}
              avatarUrl={message.user.avatarUrl}
              timestamp={message.createdAt}
              isCurrentUser={user?.id === message.userId}
              userRole={message.user.role}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t flex items-center"
      >
        <Input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button 
          type="submit" 
          className="ml-2 px-4 py-2 bg-primary text-white rounded-lg"
          disabled={!messageText.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
      
      {!user && (
        <div className="text-center text-sm p-3 bg-slate-50 text-slate-500 border-t">
          Join our community to participate in discussions!
        </div>
      )}
    </div>
  );
}
