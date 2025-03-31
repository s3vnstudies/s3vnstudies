import { Request, Response } from 'express';

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

// YouTube API key from environment variables
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '@s3vnstudies';

export async function getYouTubeVideos(req: Request, res: Response) {
  try {
    const channelId = req.query.channelId as string || YOUTUBE_CHANNEL_ID;
    const maxResults = req.query.maxResults as string || '10';
    
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
      } else {
        return res.status(404).json({ message: 'Channel not found' });
      }
    }
    
    // Fetch videos from the channel
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&maxResults=${maxResults}&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Format response
    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId
    }));
    
    res.json({ videos });
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
    
    res.json({ video: videoDetails });
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch YouTube video details',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
