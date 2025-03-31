import { useQuery } from "@tanstack/react-query";

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  views: string;
  description?: string;
}

// Function to fetch YouTube videos from our backend API
export function useYouTubeVideos(limit?: number) {
  return useQuery<YouTubeVideo[]>({
    queryKey: ["/api/youtube/videos", limit],
    queryFn: async ({ queryKey }) => {
      let url = "/api/youtube/videos";
      if (limit) {
        url += `?limit=${limit}`;
      }
      
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch videos: ${res.status}`);
      }
      
      return await res.json();
    },
  });
}

// Function to format duration from ISO 8601 format (if we were actually using YouTube Data API)
export function formatDuration(isoDuration: string): string {
  // This is a simplified implementation
  // In a real app, we would properly parse the ISO 8601 duration format
  return isoDuration;
}

// Function to format view count
export function formatViewCount(viewCount: number): string {
  if (viewCount >= 1000000) {
    return `${(viewCount / 1000000).toFixed(1)}M`;
  } else if (viewCount >= 1000) {
    return `${(viewCount / 1000).toFixed(1)}K`;
  }
  return viewCount.toString();
}

// Function to format date to "X time ago" format
export function formatPublishedDate(date: string): string {
  // This is a simplified implementation
  // In a real app, we would use a library like date-fns to format the date
  return date;
}
