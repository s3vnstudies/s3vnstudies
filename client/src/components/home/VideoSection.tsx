import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useYouTube } from "@/hooks/use-youtube";

const VideoSection = () => {
  const { getVideos } = useYouTube();

  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['/youtube/videos'],
    queryFn: () => getVideos(3)
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <span className="text-blue-600 font-medium">YouTube Channel</span>
              <h2 className="text-3xl font-bold mt-2">Latest Videos</h2>
            </div>
            <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 font-medium">
              <i className="fab fa-youtube text-xl mr-2"></i> Visit Channel
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl animate-pulse h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <span className="text-blue-600 font-medium">YouTube Channel</span>
            <h2 className="text-3xl font-bold mt-2">Latest Videos</h2>
          </div>
          <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 font-medium">
            <i className="fab fa-youtube text-xl mr-2"></i> Visit Channel
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group">
              <div className="relative">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-14 h-14 rounded-full bg-blue-600 border-0 text-white hover:bg-blue-700"
                    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-gray-900/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{video.viewCount} views</span>
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
