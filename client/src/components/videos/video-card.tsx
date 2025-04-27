import { Link } from "wouter";
import { Video } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Calendar, Lock, Heart, Plus, Check, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/use-favorites";
import { useWatchLater } from "@/hooks/use-watch-later";
import { useAuth } from "@/hooks/use-auth";

interface VideoCardProps {
  video: Video;
  showLockIcon?: boolean;
}

export default function VideoCard({ video, showLockIcon = true }: VideoCardProps) {
  const { user } = useAuth();
  const { isVideoFavorited, toggleFavorite } = useFavorites();
  const { isInWatchLater, toggleWatchLater } = useWatchLater();
  const [hovering, setHovering] = useState(false);
  
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Format duration for display
  const formatDuration = (duration: string) => {
    if (!duration) return "00:00";
    return duration;
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleFavorite(video.id);
  };
  
  const handleWatchLaterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    toggleWatchLater(video.id);
  };

  // Get image URL - fallback to YouTube thumbnail if needed
  const imageUrl = video.imageUrl || (video.externalId ? `https://img.youtube.com/vi/${video.externalId}/maxresdefault.jpg` : undefined);

  return (
    <Card 
      className="bg-neutral-50 overflow-hidden shadow-md transition-all hover:shadow-lg"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="aspect-video relative">
        <Link href={`/videos/${video.id}`}>
          <img
            src={imageUrl}
            alt={video.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-6 w-6 text-primary ml-1" />
            </div>
          </div>
          {showLockIcon && video.membershipRequired !== "free" && (
            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              <span>{video.membershipRequired}</span>
            </div>
          )}
          
          {/* Action buttons that appear on hover if user is logged in */}
          {user && (hovering || isVideoFavorited(video.id) || isInWatchLater(video.id)) && (
            <div className="absolute bottom-2 left-2 flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant={isVideoFavorited(video.id) ? "secondary" : "outline"} 
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-primary/80 border-0"
                      onClick={handleFavoriteClick}
                    >
                      <Heart 
                        className={`h-4 w-4 ${isVideoFavorited(video.id) ? "fill-current text-white" : "text-white"}`} 
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isVideoFavorited(video.id) ? "Remove from favorites" : "Add to favorites"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant={isInWatchLater(video.id) ? "secondary" : "outline"} 
                      className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm hover:bg-primary/80 border-0"
                      onClick={handleWatchLaterClick}
                    >
                      {isInWatchLater(video.id) ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <Plus className="h-4 w-4 text-white" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isInWatchLater(video.id) ? "Remove from watch later" : "Add to watch later"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </Link>
      </div>
      <CardContent className="p-5">
        <Link href={`/videos/${video.id}`}>
          <h3 className="font-bold text-lg line-clamp-2 mb-2 font-poppins hover:text-primary cursor-pointer">
            {video.title}
          </h3>
        </Link>
        <div className="flex flex-wrap items-center text-xs text-neutral-500 mb-3 gap-y-1">
          <div className="flex items-center mr-3">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDuration(video.duration || "")}</span>
          </div>
          <div className="flex items-center mr-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(video.publishDate)}</span>
          </div>
          <Badge variant={video.membershipRequired === "free" ? "outline" : "secondary"} className="text-xs ml-auto">
            {video.membershipRequired === "free" ? "Free" : video.membershipRequired}
          </Badge>
        </div>
        <div className="flex items-center text-xs text-neutral-500 mb-3">
          <span>By: {video.author || "S3vn Studies"}</span>
        </div>
        <p className="text-neutral-600 text-sm line-clamp-2">
          {video.description || "Watch this exciting video from S3vn Studies."}
        </p>
      </CardContent>
    </Card>
  );
}
