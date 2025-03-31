import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink } from "lucide-react";
import { 
  fetchYouTubeVideos, 
  formatDuration, 
  formatViewCount, 
  formatPublishedDate 
} from "@/lib/youtube-api";
import { YouTubeVideo } from "@shared/types";

export default function VideoChannel() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setIsLoading(true);
        const result = await fetchYouTubeVideos(3);
        setVideos(result.videos);
      } catch (err) {
        setError("Failed to load videos. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="text-primary font-medium">YouTube Channel</span>
            <h2 className="text-3xl font-bold font-heading mt-2">Latest Videos</h2>
          </div>
          <a 
            href="https://youtube.com/@s3vnstudies" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center text-primary font-medium"
          >
            <i className="fab fa-youtube text-xl mr-2"></i> Visit Channel
          </a>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <CardContent className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 mt-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id} 
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group"
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      href={`https://www.youtube.com/watch?v=${video.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </a>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Badge variant="outline" className="bg-dark/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border-0">
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2 line-clamp-2">{video.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatViewCount(video.viewCount)}</span>
                    <span>{formatPublishedDate(video.publishedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
