export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

// YouTube API key from environment variables
const API_KEY = process.env.YOUTUBE_API_KEY || import.meta.env.VITE_YOUTUBE_API_KEY;
const CHANNEL_ID = "UC7zQzw2l9h4IgY_Pfo_Gy_A"; // Replace with S3vn Studies actual YouTube channel ID

export async function fetchYouTubeVideos(limit = 10): Promise<YoutubeVideo[]> {
  if (!API_KEY) {
    throw new Error("YouTube API key is not configured");
  }

  try {
    // Fetch playlist items or channel uploads
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=${limit}&order=date&type=video&key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",");

    // Fetch additional video details including statistics and content details
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    );

    if (!videoDetailsResponse.ok) {
      throw new Error(`YouTube API error: ${videoDetailsResponse.status}`);
    }

    const videoDetails = await videoDetailsResponse.json();

    // Format the video data
    return videoDetails.items.map((item: any) => {
      // Format duration from ISO 8601 format
      const isoDuration = item.contentDetails.duration; // e.g., "PT12M34S"
      const durationMatch = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      
      const hours = durationMatch[1] ? parseInt(durationMatch[1]) : 0;
      const minutes = durationMatch[2] ? parseInt(durationMatch[2]) : 0;
      const seconds = durationMatch[3] ? parseInt(durationMatch[3]) : 0;
      
      let formattedDuration = "";
      if (hours > 0) {
        formattedDuration += `${hours}:`;
        formattedDuration += `${minutes.toString().padStart(2, "0")}:`;
      } else {
        formattedDuration += `${minutes}:`;
      }
      formattedDuration += seconds.toString().padStart(2, "0");

      // Format view count
      const viewCount = parseInt(item.statistics.viewCount);
      let formattedViewCount = "";
      if (viewCount >= 1000000) {
        formattedViewCount = `${(viewCount / 1000000).toFixed(1)}M`;
      } else if (viewCount >= 1000) {
        formattedViewCount = `${(viewCount / 1000).toFixed(1)}K`;
      } else {
        formattedViewCount = viewCount.toString();
      }

      // Format publish date
      const publishDate = new Date(item.snippet.publishedAt);
      const now = new Date();
      const diffInMilliseconds = now.getTime() - publishDate.getTime();
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
      
      let publishedAt = "";
      if (diffInDays < 1) {
        publishedAt = "Today";
      } else if (diffInDays === 1) {
        publishedAt = "Yesterday";
      } else if (diffInDays < 7) {
        publishedAt = `${diffInDays} days ago`;
      } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        publishedAt = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        publishedAt = `${months} month${months > 1 ? "s" : ""} ago`;
      } else {
        const years = Math.floor(diffInDays / 365);
        publishedAt = `${years} year${years > 1 ? "s" : ""} ago`;
      }

      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt,
        viewCount: formattedViewCount,
        duration: formattedDuration
      };
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    throw error;
  }
}
