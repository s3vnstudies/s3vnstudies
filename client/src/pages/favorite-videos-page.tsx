import { useEffect } from "react";
import { useLocation } from "wouter";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/hooks/use-auth";
import VideoCard from "@/components/videos/video-card";
import { Loader2, Heart } from "lucide-react";
import { type Video } from "@shared/schema";

export default function FavoriteVideosPage() {
  const { favoriteVideos, isLoading } = useFavorites();
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
        <Heart className="text-primary h-6 w-6 mr-3" />
        <h1 className="text-3xl font-bold">Your Favorites</h1>
      </div>
      
      {favoriteVideos.length === 0 ? (
        <div className="bg-muted/30 rounded-lg p-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You haven't added any videos to your favorites yet. Browse our videos and click the heart icon to add them here.
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
          {favoriteVideos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}