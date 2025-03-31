import { useState } from "react";
import { fetchYouTubeVideos, YoutubeVideo } from "@/lib/youtube-api";

export function useYouTube() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVideos = async (limit = 10): Promise<YoutubeVideo[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const videos = await fetchYouTubeVideos(limit);
      return videos;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred fetching videos");
      console.error("YouTube API error:", err);
      
      // Return mocked videos in case of error (only for development)
      return getMockVideos(limit);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getVideos
  };
}

// Mock videos for development/fallback
function getMockVideos(limit: number): YoutubeVideo[] {
  const mockVideos: YoutubeVideo[] = [
    {
      id: "mock1",
      title: "Getting Started with React: Complete Beginner's Guide",
      description: "Learn the fundamentals of React in this comprehensive tutorial for beginners.",
      thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      publishedAt: "2 weeks ago",
      viewCount: "1.2K",
      duration: "12:34"
    },
    {
      id: "mock2",
      title: "10 Advanced CSS Techniques You Should Know",
      description: "Level up your CSS skills with these advanced techniques for modern web development.",
      thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "1 month ago",
      viewCount: "3.4K",
      duration: "18:47"
    },
    {
      id: "mock3",
      title: "Building a Complete Web App with Node.js & Express",
      description: "Follow along as we build a full-stack web application using Node.js and Express.",
      thumbnail: "https://images.unsplash.com/photo-1581472723648-909f4851d4ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2 months ago",
      viewCount: "5.7K",
      duration: "24:15"
    }
  ];

  return mockVideos.slice(0, limit);
}
