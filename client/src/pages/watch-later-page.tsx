import { useEffect } from "react";
import { useLocation } from "wouter";
import { useWatchLater } from "@/hooks/use-watch-later";
import { useAuth } from "@/hooks/use-auth";
import VideoCard from "@/components/videos/video-card";
import { Loader2, Clock } from "lucide-react";
import { type Video } from "@shared/schema";

export default function WatchLaterPage() {
  const { watchLaterVideos, isLoading } = useWatchLater();
  const { user } = useAuth();
  const [location, navigate] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Clock className="text-primary h-6 w-6 mr-3" />
        <h1 className="text-3xl font-bold">Watch Later</h1>
      </div>
      
      {watchLaterVideos.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your watch later list is empty</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Save videos to watch later by clicking the "+" icon on any video card. They'll appear here for easy access.
          </p>
          <button
            onClick={() => navigate("/videos")}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Videos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchLaterVideos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}