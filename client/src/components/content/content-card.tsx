import { Link } from "wouter";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, getInitials } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Eye, MessageSquare, Users } from "lucide-react";

type ContentType = "video" | "article" | "community";

interface ContentCardProps {
  id: number | string;
  type: ContentType;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  stats?: {
    views?: number;
    comments?: number;
  };
}

export default function ContentCard({
  id,
  type,
  title,
  description,
  imageUrl,
  date,
  author,
  stats,
}: ContentCardProps) {
  // Determine the link path based on content type
  const getContentLink = () => {
    switch (type) {
      case "video":
        return ROUTES.VIDEO_DETAIL(id as string);
      case "article":
        return ROUTES.ARTICLE_DETAIL(id as number);
      case "community":
        return ROUTES.BULLETIN_POST(id as number);
      default:
        return "#";
    }
  };

  // Get badge styles based on content type
  const getBadgeStyles = () => {
    switch (type) {
      case "video":
        return "bg-primary bg-opacity-10 text-primary";
      case "article":
        return "bg-secondary bg-opacity-10 text-secondary";
      case "community":
        return "bg-amber-500 bg-opacity-10 text-amber-700";
      default:
        return "";
    }
  };

  // Get stats icon based on content type
  const getStatsIcon = () => {
    switch (type) {
      case "video":
        return <Eye className="h-4 w-4 mr-1" />;
      case "article":
        return <MessageSquare className="h-4 w-4 mr-1" />;
      case "community":
        return <Users className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Link href={getContentLink()}>
      <Card className="h-full group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:opacity-75 transition-opacity">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
          />
        </div>
        <CardContent className="flex-1 p-6 flex flex-col">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Badge variant="outline" className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${getBadgeStyles()}`}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <span>{formatDate(date)}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="mt-3 text-base text-gray-500 flex-grow">
            {description}
          </p>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <Link href={ROUTES.PROFILE(author.username)}>
                <Avatar>
                  <AvatarImage src={author.avatar || ""} alt={author.username} />
                  <AvatarFallback className="bg-primary text-white">
                    {getInitials(author.username)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{author.username}</p>
              {stats && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  {getStatsIcon()}
                  <span>
                    {stats.views && `${stats.views.toLocaleString()} views`}
                    {stats.comments && `${stats.comments} comments`}
                    {!stats.views && !stats.comments && 'Community Post'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
