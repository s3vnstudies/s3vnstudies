import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Youtube, RefreshCw, Calendar, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/lib/queryClient";

// Database video format from our storage
interface VideoType {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  embedUrl: string | null;
  duration: string | null;
  publishDate: string;
  views: number;
  membershipRequired: string;
  category: string;
  featured: boolean;
  externalId: string | null;
  source: string;
}

// Video card component to display a video in the grid
interface VideoCardProps {
  video: VideoType;
}

function VideoCard({ video }: VideoCardProps) {
  const [hovering, setHovering] = useState(false);
  
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleCardClick = () => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    }
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
          src={video.imageUrl || '/assets/video-placeholder.svg'}
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
            <span>{formatDate(video.publishDate)}</span>
          </div>
          {video.views > 0 && (
            <div className="flex items-center">
              <span>Views: {video.views.toLocaleString()}</span>
            </div>
          )}
        </div>
        <p className="text-neutral-600 text-sm line-clamp-2">
          {video.description || "Watch this exciting video from S3vn Studies."}
        </p>
      </CardContent>
    </Card>
  );
}

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  // Set page title
  useEffect(() => {
    document.title = "Videos - S3vn Studies";
  }, []);

  // Fetch videos from our database (that we synced from YouTube)
  const { data, isLoading, error } = useQuery<VideoType[]>({
    queryKey: ["/api/youtube/videos"],
  });

  // YouTube sync mutation for admins
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/youtube/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelId: '@s3vnstudies', maxResults: 50 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync YouTube videos');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/youtube/videos'] });
      toast({
        title: "Success",
        description: "YouTube videos successfully synchronized",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sync videos",
        variant: "destructive",
      });
    }
  });

  // Filter videos based on search query
  const filteredVideos = data
    ? data.filter((video) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            video.title.toLowerCase().includes(query) ||
            (video.description && video.description.toLowerCase().includes(query))
          );
        }
        return true;
      })
    : [];

  return (
    <main className="flex-1">
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
            <Youtube className="inline-block mr-2 h-8 w-8" />
            YouTube Videos
          </h1>
          <p className="text-lg opacity-90">
            Watch our latest educational videos from the S3vn Studies YouTube channel
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Admin sync button */}
          {isAdmin && (
            <Button 
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending} 
              variant="outline"
              className="flex items-center gap-2"
            >
              {syncMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Sync YouTube Videos
                </>
              )}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading videos from YouTube...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Error loading videos. Please try again later.</p>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600">No videos found matching your search criteria.</p>
            
            {isAdmin && filteredVideos.length === 0 && !searchQuery && (
              <div className="mt-4">
                <Button 
                  onClick={() => syncMutation.mutate()}
                  disabled={syncMutation.isPending}
                  variant="outline"
                  className="mx-auto"
                >
                  {syncMutation.isPending ? "Syncing..." : "Sync YouTube Videos"}
                </Button>
                <p className="text-sm text-neutral-500 mt-2">No videos found. Try syncing with YouTube</p>
              </div>
            )}
          </div>
        )}
        
        <div className="text-center mt-8">
          <a 
            href="https://www.youtube.com/@s3vnstudies" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Youtube className="h-5 w-5" />
            Visit Our YouTube Channel
          </a>
        </div>
      </div>
    </main>
  );
}
