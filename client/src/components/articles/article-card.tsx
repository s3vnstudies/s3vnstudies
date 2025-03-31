import { Link } from "wouter";
import { Article } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ArticleCardProps {
  article: Article;
  showLockIcon?: boolean;
}

export default function ArticleCard({ article, showLockIcon = true }: ArticleCardProps) {
  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className="bg-neutral-50 overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <Link href={`/articles/${article.id}`}>
          <img
            src={article.thumbnail || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"}
            alt={article.title}
            className="w-full h-full object-cover transition-transform hover:scale-105 cursor-pointer"
          />
        </Link>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Badge variant="secondary" className="mr-2">
            {article.category}
          </Badge>
          <span className="text-neutral-500 text-sm">
            {formatDate(article.publishDate)}
          </span>
          {showLockIcon && article.membershipRequired !== "free" && (
            <div className="ml-auto flex items-center text-xs text-neutral-600">
              <Lock className="h-3 w-3 mr-1" />
              <span>{article.membershipRequired}</span>
            </div>
          )}
        </div>
        <Link href={`/articles/${article.id}`}>
          <h3 className="font-bold text-xl mb-2 font-poppins hover:text-primary cursor-pointer">
            {article.title}
          </h3>
        </Link>
        <p className="text-neutral-600 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-neutral-500">By {article.author}</div>
          <Link
            href={`/articles/${article.id}`}
            className="inline-flex items-center text-primary font-medium"
          >
            Read More
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
