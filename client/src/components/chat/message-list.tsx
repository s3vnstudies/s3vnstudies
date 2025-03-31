import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id?: number;
  roomId: number;
  content: string;
  sentAt: Date;
  sender: {
    id?: number;
    username?: string;
    displayName: string;
  };
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth();

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message, index) => {
        const isCurrentUser = message.sender.id === user?.id;
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const showAvatar =
          !prevMessage ||
          prevMessage.sender.id !== message.sender.id ||
          new Date(message.sentAt).getTime() - new Date(prevMessage.sentAt).getTime() > 60000;

        return (
          <div
            key={message.id || index}
            className={`flex items-start ${isCurrentUser ? "justify-end" : ""}`}
          >
            {!isCurrentUser && showAvatar && (
              <Avatar className="h-8 w-8 mr-2">
                <AvatarFallback className="bg-primary text-white">
                  {message.sender.displayName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[75%] ${
                isCurrentUser
                  ? "bg-primary text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                  : "bg-neutral-100 text-neutral-900 rounded-tl-lg rounded-tr-lg rounded-br-lg"
              } px-4 py-2`}
            >
              {showAvatar && !isCurrentUser && (
                <div className="font-medium text-sm mb-1">{message.sender.displayName}</div>
              )}
              <div>{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  isCurrentUser ? "text-white/70" : "text-neutral-500"
                }`}
              >
                {format(new Date(message.sentAt), "h:mm a")}
              </div>
            </div>

            {isCurrentUser && showAvatar && (
              <Avatar className="h-8 w-8 ml-2">
                <AvatarFallback className="bg-primary text-white">
                  {user?.displayName?.substring(0, 2).toUpperCase() ||
                    user?.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        );
      })}
    </div>
  );
}
