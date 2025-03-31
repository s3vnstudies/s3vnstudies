import { Link } from "wouter";
import { Video } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Calendar, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  video: Video;
  showLockIcon?: boolean;
}

export default function VideoCard({ video, showLockIcon = true }: VideoCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Format duration for display
  const formatDuration = (duration: string) => {
    if (!duration) return "00:00";
    return duration;
  };

  return (
    <Card className="bg-neutral-50 overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="aspect-video relative">
        <Link href={`/videos/${video.id}`}>
          <img
            src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
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
        <p className="text-neutral-600 text-sm line-clamp-2">
          {video.description || "Watch this exciting video from S3vn Studies."}
        </p>
      </CardContent>
    </Card>
  );
}
