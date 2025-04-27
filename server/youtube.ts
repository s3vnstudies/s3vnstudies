import { Request, Response } from 'express';
import { storage } from './storage';
import { Video, InsertVideo } from '@shared/schema';

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

interface YouTubeVideoDetails extends YouTubeVideo {
  viewCount: string;
  likeCount: string;
  commentCount: string;
  duration: string;
}

// YouTube API key from environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '@s3vnstudies';

/**
 * Get videos from our database (videos table) that were sourced from YouTube
 */
export async function getYouTubeVideos(req: Request, res: Response) {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    
    // First try to get videos from our database
    const dbVideos = await storage.getVideos(limit, offset);
    
    // Filter to only show YouTube videos
    const youtubeVideos = dbVideos.filter(video => video.source === 'youtube');
    
    // If we have videos in our database, return them
    if (youtubeVideos.length > 0) {
      return res.json(youtubeVideos);
    }
    
    // If no videos in database, fetch from YouTube API and store them
    console.log('No YouTube videos found in database, fetching from YouTube API...');
    const freshVideos = await syncYouTubeVideos(YOUTUBE_CHANNEL_ID, limit);
    
    res.json(freshVideos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ 
      message: 'Failed to fetch YouTube videos',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getYouTubeVideoDetails(req: Request, res: Response) {
  try {
    const videoId = req.params.videoId;
    
    if (!videoId) {
      return res.status(400).json({ message: 'Video ID is required' });
    }
    
    // First check if we have this video in our database
    const allVideos = await storage.getVideos();
    const videoInDb = allVideos.find(v => v.externalId === videoId);
    
    if (videoInDb) {
      return res.json(videoInDb);
    }
    
    // If not in database, fetch from YouTube API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    const videoDetails = {
      id: data.items[0].id,
      title: data.items[0].snippet.title,
      description: data.items[0].snippet.description,
      publishedAt: data.items[0].snippet.publishedAt,
      thumbnails: data.items[0].snippet.thumbnails,
      channelTitle: data.items[0].snippet.channelTitle,
      channelId: data.items[0].snippet.channelId,
      viewCount: data.items[0].statistics.viewCount,
      likeCount: data.items[0].statistics.likeCount,
      commentCount: data.items[0].statistics.commentCount,
      duration: data.items[0].contentDetails.duration
    };
    
    // Format the video for our database structure and save it
    const videoData: InsertVideo = {
      title: videoDetails.title,
      description: videoDetails.description || '',
      imageUrl: videoDetails.thumbnails.high.url,
      videoUrl: `https://www.youtube.com/watch?v=${videoDetails.id}`,
      embedUrl: `https://www.youtube.com/embed/${videoDetails.id}`,
      duration: videoDetails.duration,
      publishDate: new Date(videoDetails.publishedAt),
      membershipRequired: 'free',
      category: 'youtube',
      featured: false,
      views: parseInt(videoDetails.viewCount || '0'),
      externalId: videoDetails.id,
      source: 'youtube'
    };
    
    const savedVideo = await storage.createVideo(videoData);
    
    res.json(savedVideo);
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch YouTube video details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

/**
 * Sync YouTube videos from channel to our database
 */
export async function syncYouTubeVideos(channelId: string = YOUTUBE_CHANNEL_ID, maxResults: number = 50): Promise<Video[]> {
  try {
    console.log(`Syncing YouTube videos from channel: ${channelId}`);
    
    // First get the channel info to extract the actual channel ID if provided with a custom URL
    let actualChannelId = channelId;
    
    if (channelId.startsWith('@')) {
      const channelResponse = await fetch(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelId)}&type=channel&key=${YOUTUBE_API_KEY}`
      );
      
      if (!channelResponse.ok) {
        throw new Error(`YouTube API error: ${channelResponse.statusText}`);
      }
      
      const channelData = await channelResponse.json();
      if (channelData.items && channelData.items.length > 0) {
        actualChannelId = channelData.items[0].id.channelId;
        console.log(`Resolved channel ID: ${actualChannelId}`);
      } else {
        throw new Error('Channel not found');
      }
    }
    
    // Fetch videos from the channel
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!videosResponse.ok) {
      throw new Error(`YouTube API error: ${videosResponse.statusText}`);
    }
    
    const videosData = await videosResponse.json();
    
    if (!videosData.items || videosData.items.length === 0) {
      return [];
    }
    
    console.log(`Found ${videosData.items.length} videos from YouTube API`);
    
    // Process each video and save to database
    const syncedVideos: Video[] = [];
    let existingVideos = await storage.getVideos();
    
    for (const item of videosData.items) {
      try {
        // Get detailed video information
        const videoId = item.id.videoId;
        const detailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
        );
        
        if (!detailsResponse.ok) {
          console.warn(`Error fetching details for video ${videoId}, skipping`);
          continue;
        }
        
        const detailsData = await detailsResponse.json();
        if (!detailsData.items || !detailsData.items[0]) {
          console.warn(`No details found for video ${videoId}, skipping`);
          continue;
        }
        
        const videoDetails = detailsData.items[0];
        
        // Format the video for our database
        const videoData: InsertVideo = {
          title: videoDetails.snippet.title,
          description: videoDetails.snippet.description || '',
          imageUrl: videoDetails.snippet.thumbnails.high?.url || videoDetails.snippet.thumbnails.medium?.url || videoDetails.snippet.thumbnails.default?.url,
          videoUrl: `https://www.youtube.com/watch?v=${videoDetails.id}`,
          embedUrl: `https://www.youtube.com/embed/${videoDetails.id}`,
          duration: videoDetails.contentDetails.duration,
          publishDate: new Date(videoDetails.snippet.publishedAt),
          membershipRequired: 'free',
          category: 'youtube',
          featured: false,
          views: parseInt(videoDetails.statistics.viewCount || '0'),
          externalId: videoDetails.id,
          source: 'youtube'
        };
        
        // Check if video already exists in our database
        const existingVideo = existingVideos.find(v => v.externalId === videoDetails.id);
        
        let savedVideo: Video;
        if (existingVideo) {
          // Update existing video
          savedVideo = await storage.updateVideo(existingVideo.id, videoData) as Video;
          console.log(`Updated existing video: ${savedVideo.title}`);
        } else {
          // Create new video
          savedVideo = await storage.createVideo(videoData);
          console.log(`Created new video: ${savedVideo.title}`);
        }
        
        syncedVideos.push(savedVideo);
      } catch (error) {
        console.error(`Error processing video ${item.id.videoId}:`, error);
      }
    }
    
    console.log(`Successfully synced ${syncedVideos.length} videos`);
    return syncedVideos;
  } catch (error) {
    console.error('Error in syncYouTubeVideos:', error);
    throw error;
  }
}

/**
 * Handler for the /api/youtube/sync route
 */
export async function handleYouTubeSync(req: Request, res: Response) {
  try {
    const channelId = req.body.channelId || YOUTUBE_CHANNEL_ID;
    const maxResults = parseInt(req.body.maxResults as string) || 50;

    const syncedVideos = await syncYouTubeVideos(channelId, maxResults);
    
    res.json({
      success: true,
      message: `Successfully synced ${syncedVideos.length} videos`,
      videos: syncedVideos
    });
  } catch (error) {
    console.error('Error syncing YouTube videos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync YouTube videos',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
