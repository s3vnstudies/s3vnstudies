import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Video } from "@shared/schema";

export const useWatchLater = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get user's watch later videos
  const {
    data: watchLaterVideos,
    isLoading,
    error,
    refetch
  } = useQuery<Video[]>({
    queryKey: ["/api/watch-later"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/watch-later");
      if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error("Failed to fetch watch later videos");
      }
      return res.json();
    }
  });

  // Check if a video is in watch later
  const isInWatchLater = (videoId: number): boolean => {
    if (!watchLaterVideos) return false;
    return watchLaterVideos.some((video: Video) => video.id === videoId);
  };
  
  // Add a video to watch later
  const addToWatchLaterMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("POST", `/api/watch-later/${videoId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add to watch later");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watch-later"] });
      toast({
        title: "Added to watch later",
        description: "Video has been added to your watch later list",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Remove a video from watch later
  const removeFromWatchLaterMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("DELETE", `/api/watch-later/${videoId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove from watch later");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watch-later"] });
      toast({
        title: "Removed from watch later",
        description: "Video has been removed from your watch later list",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Toggle watch later status
  const toggleWatchLater = (videoId: number) => {
    if (isInWatchLater(videoId)) {
      removeFromWatchLaterMutation.mutate(videoId);
    } else {
      addToWatchLaterMutation.mutate(videoId);
    }
  };
  
  return {
    watchLaterVideos: watchLaterVideos || [],
    isLoading,
    error,
    isInWatchLater,
    toggleWatchLater,
    addToWatchLater: addToWatchLaterMutation.mutate,
    removeFromWatchLater: removeFromWatchLaterMutation.mutate,
    refetch
  };
};