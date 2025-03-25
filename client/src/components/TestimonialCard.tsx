import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorImage?: string;
  authorInfo: string;
  rating: number;
  className?: string;
}

export default function TestimonialCard({
  quote,
  authorName,
  authorImage,
  authorInfo,
  rating,
  className,
}: TestimonialCardProps) {
  // Generate rating stars
  const renderRating = () => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full star
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
      } else if (i - 0.5 <= rating) {
        // Half star
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
      } else {
        // Empty star
        stars.push(<Star key={i} className="h-4 w-4 text-slate-300" />);
      }
    }
    
    return stars;
  };

  return (
    <Card className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {renderRating()}
        </div>
        <Quote className="h-6 w-6 text-slate-200" />
      </div>
      
      <p className="text-slate-700 mb-6">"{quote}"</p>
      
      <div className="flex items-center">
        <Avatar className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <AvatarImage src={authorImage} alt={authorName} />
          <AvatarFallback>{getInitials(authorName)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h4 className="font-medium">{authorName}</h4>
          <p className="text-slate-500 text-sm">{authorInfo}</p>
        </div>
      </div>
    </Card>
  );
}
