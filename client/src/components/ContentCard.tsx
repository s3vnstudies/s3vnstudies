import { Link } from "wouter";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Play, Clock } from "lucide-react";

interface ContentCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  type: "video" | "article";
  category?: string;
  date: Date | string;
  isPremium?: boolean;
  duration?: string;
  link: string;
  className?: string;
}

export default function ContentCard({
  id,
  title,
  description,
  imageUrl,
  type,
  category,
  date,
  isPremium = false,
  duration,
  link,
  className,
}: ContentCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-xl shadow-lg overflow-hidden h-full flex flex-col border border-border/40",
      className
    )}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {type === "video" ? (
          <>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button className="w-14 h-14 rounded-full bg-primary bg-opacity-90 flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </button>
            </div>
            {duration && (
              <span className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 text-sm rounded flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </span>
            )}
          </>
        ) : (
          category && (
            <span className="absolute top-3 left-3 inline-block px-3 py-1 bg-primary/90 text-white text-xs font-medium rounded-full">
              {category}
            </span>
          )
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
          <Link href={link}>{title}</Link>
        </h3>
        <p className="text-foreground/80 text-sm mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-foreground/70">{formatRelativeTime(date)}</span>
          {isPremium ? (
            <Badge variant="default" className="bg-gradient-to-r from-primary to-secondary">Premium</Badge>
          ) : (
            <Badge variant="outline" className="text-foreground/80">Free</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
