import { useState } from "react";
import { Link } from "wouter";
import { BulletinPost } from "@/lib/types";
import { formatDate, formatRelativeTime, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Pin } from "lucide-react";

interface BulletinCardProps {
  post: BulletinPost;
  preview?: boolean;
}

export default function BulletinCard({ post, preview = false }: BulletinCardProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  // Truncate content for preview mode
  const displayContent = preview 
    ? post.content.length > 150 
      ? post.content.substring(0, 150) + "..." 
      : post.content
    : post.content;

  return (
    <Card className={`mb-4 ${post.isPinned ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Link href={ROUTES.PROFILE(post.author?.username || "")}>
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.author?.avatar} alt={post.author?.username} />
                <AvatarFallback className="bg-primary text-white">
                  {post.author?.username ? getInitials(post.author.username) : "?"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="flex items-center">
                <Link href={ROUTES.PROFILE(post.author?.username || "")}>
                  <span className="font-medium text-gray-900 hover:text-primary">
                    {post.author?.username || "Unknown"}
                  </span>
                </Link>
                {post.isPinned && (
                  <Badge variant="outline" className="ml-2 px-2 py-1 text-xs bg-primary bg-opacity-10 text-primary">
                    <Pin className="h-3 w-3 mr-1" />
                    Pinned
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                {formatDate(post.createdAt)} ({formatRelativeTime(post.createdAt)})
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-3">
          <Link href={ROUTES.BULLETIN_POST(post.id)}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-primary transition-colors">
              {post.title}
            </h3>
          </Link>
          <div className="mt-2 text-gray-600 whitespace-pre-line">
            {displayContent}
          </div>
          {preview && post.content.length > 150 && (
            <Link href={ROUTES.BULLETIN_POST(post.id)}>
              <Button variant="link" className="p-0 h-auto mt-1">
                Read more
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`flex items-center ${liked ? 'text-primary' : 'text-gray-500'}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            <span>{likes ? likes : ""}</span>
            <span className="sr-only">Like</span>
          </Button>
          <Link href={ROUTES.BULLETIN_POST(post.id)}>
            <Button variant="ghost" size="sm" className="flex items-center text-gray-500">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Reply</span>
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
