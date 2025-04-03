import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Video } from "@shared/schema";

export const useFavorites = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get user's favorite videos
  const {
    data: favoriteVideos,
    isLoading,
    error,
    refetch
  } = useQuery<Video[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/favorites");
      if (!res.ok) {
        if (res.status === 401) return [];
        throw new Error("Failed to fetch favorite videos");
      }
      return res.json();
    }
  });

  // Check if a video is in favorites
  const isVideoFavorited = (videoId: number): boolean => {
    if (!favoriteVideos) return false;
    return favoriteVideos.some((video: Video) => video.id === videoId);
  };
  
  // Add a video to favorites
  const addToFavoritesMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("POST", `/api/favorites/${videoId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add to favorites");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "Video has been added to your favorites",
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
  
  // Remove a video from favorites
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("DELETE", `/api/favorites/${videoId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to remove from favorites");
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Video has been removed from your favorites",
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
  
  // Toggle favorite status
  const toggleFavorite = (videoId: number) => {
    if (isVideoFavorited(videoId)) {
      removeFromFavoritesMutation.mutate(videoId);
    } else {
      addToFavoritesMutation.mutate(videoId);
    }
  };
  
  return {
    favoriteVideos: favoriteVideos || [],
    isLoading,
    error,
    isVideoFavorited,
    toggleFavorite,
    addToFavorites: addToFavoritesMutation.mutate,
    removeFromFavorites: removeFromFavoritesMutation.mutate,
    refetch
  };
};