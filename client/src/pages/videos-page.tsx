import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import YouTubeVideoCard from "@/components/videos/youtube-video-card";
import { Input } from "@/components/ui/input";
import { Search, Youtube } from "lucide-react";

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

interface YouTubeResponse {
  videos: YouTubeVideo[];
}

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Set page title
  useEffect(() => {
    document.title = "Videos - S3vn Studies";
  }, []);

  // Fetch videos from YouTube
  const { data, isLoading, error } = useQuery<YouTubeResponse>({
    queryKey: ["/api/youtube/videos"],
  });

  // Filter videos based on search query
  const filteredVideos = data?.videos
    ? data.videos.filter((video) => {
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            video.title.toLowerCase().includes(query) ||
            video.description.toLowerCase().includes(query)
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
              <YouTubeVideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-neutral-600">No videos found matching your search criteria.</p>
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
