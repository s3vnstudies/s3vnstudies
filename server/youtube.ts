import { storage } from "./storage";
import { InsertVideo } from "@shared/schema";

// YouTube channel ID
const CHANNEL_ID = "s3vnstudies";

export async function setupYoutubeApi() {
  const apiKey = process.env.YOUTUBE_API_KEY || "";
  
  if (!apiKey) {
    console.warn("YouTube API key not provided. YouTube integration is disabled.");
    return;
  }
  
  console.log("Setting up YouTube API integration...");
  
  // Start a periodic sync
  syncYoutubeVideos(apiKey);
  
  // Set up a periodic sync every hour
  setInterval(() => {
    syncYoutubeVideos(apiKey);
  }, 60 * 60 * 1000); // 1 hour
}

async function syncYoutubeVideos(apiKey: string) {
  try {
    console.log("Syncing YouTube videos...");
    
    // Fetch videos from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=50&order=date&type=video&key=${apiKey}`
    );
    
    if (!response.ok) {
      console.error("Failed to fetch YouTube videos:", await response.text());
      return;
    }
    
    const data = await response.json();
    const videos = data.items || [];
    
    // Get detailed video information including duration
    for (const video of videos) {
      try {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const description = video.snippet.description;
        const thumbnailUrl = video.snippet.thumbnails.high.url;
        const publishedAt = video.snippet.publishedAt;
        
        // Check if video already exists in our database
        const existingVideo = await storage.getVideoByYoutubeId(videoId);
        
        if (!existingVideo) {
          // Get video details including duration
          const videoDetailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`
          );
          
          if (!videoDetailsResponse.ok) {
            console.error("Failed to fetch video details:", await videoDetailsResponse.text());
            continue;
          }
          
          const videoDetailsData = await videoDetailsResponse.json();
          const videoDetails = videoDetailsData.items[0];
          
          // ISO 8601 duration format (e.g., PT1H2M3S)
          const duration = videoDetails?.contentDetails?.duration || "";
          
          // Convert ISO 8601 duration to human-readable format
          const readableDuration = formatDuration(duration);
          
          // Insert video into database
          const videoData: InsertVideo = {
            youtubeId: videoId,
            title,
            description,
            thumbnailUrl,
            duration: readableDuration,
            publishedAt: new Date(publishedAt),
            isPremium: false // By default, new videos are not premium
          };
          
          await storage.createVideo(videoData);
          console.log(`Added new video: ${title}`);
        }
      } catch (error) {
        console.error("Error processing video:", error);
      }
    }
    
    console.log("YouTube video sync completed.");
  } catch (error) {
    console.error("YouTube sync error:", error);
  }
}

// Function to convert ISO 8601 duration to human-readable format
function formatDuration(isoDuration: string): string {
  const matches = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!matches) {
    return "";
  }
  
  const hours = matches[1] ? parseInt(matches[1]) : 0;
  const minutes = matches[2] ? parseInt(matches[2]) : 0;
  const seconds = matches[3] ? parseInt(matches[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
