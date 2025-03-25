import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: string;
  username: string;
  avatarUrl: string;
  timestamp: Date | string;
  isCurrentUser: boolean;
  userRole?: string;
}

export default function MessageBubble({
  message,
  username,
  avatarUrl,
  timestamp,
  isCurrentUser,
  userRole = "member"
}: MessageBubbleProps) {
  return (
    <div className={cn(
      "flex",
      isCurrentUser && "flex-row-reverse"
    )}>
      <Avatar className="w-10 h-10 overflow-hidden flex-shrink-0 mr-3 ml-0">
        <AvatarImage src={avatarUrl} alt={username} />
        <AvatarFallback>{getInitials(username)}</AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "max-w-[75%]",
        isCurrentUser && "items-end"
      )}>
        <div className="flex items-center mb-1">
          <span className="font-medium mr-2">{username}</span>
          
          {userRole === "admin" && (
            <Badge className="bg-accent text-white text-xs px-2 py-0.5 rounded mr-2">
              Admin
            </Badge>
          )}
          
          {userRole === "moderator" && (
            <Badge className="bg-primary text-white text-xs px-2 py-0.5 rounded mr-2">
              Moderator
            </Badge>
          )}
          
          <span className="text-xs text-slate-500">{formatRelativeTime(timestamp)}</span>
        </div>
        
        <div className={cn(
          "rounded-xl p-3",
          isCurrentUser 
            ? "bg-primary text-white rounded-tr-none" 
            : "bg-slate-100 text-slate-800 rounded-tl-none"
        )}>
          <p>{message}</p>
        </div>
        
        <div className="mt-2 flex space-x-3">
          <button className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            <span>Like</span>
          </button>
          <button className="text-sm text-slate-500 hover:text-primary transition-colors flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>Reply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
