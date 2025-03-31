import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Play } from "lucide-react";

interface ContentCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  contentType: string;
  date: string;
  category: string;
  duration: string;
  author: {
    name: string;
    avatar: string;
  };
}

const ContentCard = ({
  id,
  title,
  description,
  image,
  contentType,
  date,
  category,
  duration,
  author,
}: ContentCardProps) => {
  // Map content type to URL path and badge colors
  const contentTypeMap: Record<string, { path: string; color: string }> = {
    article: { path: "/articles", color: "bg-blue-600" },
    video: { path: "/videos", color: "bg-purple-500" },
    workshop: { path: "/community", color: "bg-green-500" },
  };

  const { path, color } = contentTypeMap[contentType] || contentTypeMap.article;
  const isVideo = contentType === "video";
  const isWorkshop = contentType === "workshop";

  return (
    <Link href={`${path}/${id}`}>
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition group h-full">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge className={color}>{contentType.charAt(0).toUpperCase() + contentType.slice(1)}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-gray-900/70 backdrop-blur-sm text-white">
              <Clock className="mr-1 h-3 w-3" />
              {duration}
            </Badge>
          </div>
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Play className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          )}
          {isWorkshop && (
            <div className="absolute top-3 right-3">
              <Badge variant="destructive">
                <Clock className="mr-1 h-3 w-3" />
                {duration}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center text-xs text-gray-500 mb-3">
            <span className="mr-3">{date}</span>
            <span>{category}</span>
          </div>
          <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author.name}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentCard;
