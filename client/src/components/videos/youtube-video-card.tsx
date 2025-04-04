import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Play } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string; width: number; height: number };
    medium: { url: string; width: number; height: number };
    high: { url: string; width: number; height: number };
  };
  channelTitle: string;
  channelId: string;
}

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
}

export default function YouTubeVideoCard({ video }: YouTubeVideoCardProps) {
  const [hovering, setHovering] = useState(false);
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleCardClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <Card 
      className="bg-neutral-50 overflow-hidden shadow-md transition-all hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={handleCardClick}
    >
      <div className="aspect-video relative">
        <img
          src={video.thumbnails.high.url || video.thumbnails.medium.url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${hovering ? 'opacity-100' : 'opacity-70'} transition-opacity`}>
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="h-6 w-6 text-primary ml-1" />
          </div>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="font-bold text-lg line-clamp-2 mb-2 font-poppins text-neutral-800">
          {video.title}
        </h3>
        <div className="flex flex-wrap items-center text-xs text-neutral-500 mb-3 gap-y-1">
          <div className="flex items-center mr-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(video.publishedAt)}</span>
          </div>
        </div>
        <p className="text-neutral-600 text-sm line-clamp-2">
          {video.description || "Watch this exciting video from S3vn Studies."}
        </p>
      </CardContent>
    </Card>
  );
}