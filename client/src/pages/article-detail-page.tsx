import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Article } from "@shared/schema";
import { Lock, ArrowLeft, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";

export default function ArticleDetailPage() {
  const { user } = useAuth();
  const [match, params] = useRoute("/articles/:id");
  const articleId = match ? parseInt(params.id) : null;

  const { data: article, isLoading, error } = useQuery<Article>({
    queryKey: [`/api/articles/${articleId}`],
    enabled: !!articleId,
  });

  // Set page title
  useEffect(() => {
    if (article) {
      document.title = `${article.title} - S3vn Studies`;
    } else {
      document.title = "Article - S3vn Studies";
    }
  }, [article]);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Determine if user can access this article
  const canAccess = (): boolean => {
    if (!article) return false;
    if (article.membershipRequired === "free") return true;
    if (!user) return false;

    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1,
      "vip": 2,
    };

    const requiredLevel = tierLevels[article.membershipRequired];
    const userLevel = tierLevels[user.membershipTier];

    return userLevel >= requiredLevel;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
          <div className="mb-8">
            <Link href="/articles">
              <Button variant="ghost" className="flex items-center p-0 h-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>
          </div>
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex items-center mb-6">
            <Skeleton className="h-6 w-24 mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-64 w-full mb-8 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error || !article) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Article</h1>
          <p className="text-neutral-600 mb-6">
            The article could not be loaded. It may have been removed or you might not have permission to view it.
          </p>
          <Button asChild>
            <Link href="/articles">Back to Articles</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href="/articles">
            <Button variant="ghost" className="flex items-center p-0 h-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">{article.title}</h1>

        <div className="flex flex-wrap items-center mb-6 gap-y-2">
          <Badge variant="secondary" className="mr-3">
            {article.category}
          </Badge>
          <div className="flex items-center text-neutral-500 mr-3">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(article.publishDate)}</span>
          </div>
          <div className="text-neutral-600">By {article.author || "S3vn Studies"}</div>
          
          {article.membershipRequired !== "free" && (
            <Badge variant="outline" className="ml-auto flex items-center">
              <Lock className="h-3 w-3 mr-1" />
              {article.membershipRequired} Content
            </Badge>
          )}
        </div>

        {article.thumbnail && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {!canAccess() ? (
          <div className="bg-primary/5 p-8 rounded-lg text-center mb-8">
            <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold font-poppins mb-2">This is Premium Content</h2>
            <p className="text-neutral-600 mb-6">
              This article requires a {article.membershipRequired} membership to access.
            </p>
            <Button asChild>
              <Link href={user ? "/membership" : "/auth"}>
                {user ? "Upgrade Membership" : "Sign In"}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="prose max-w-none dark:prose-invert">
            {/* Render HTML content safely */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <h3 className="text-xl font-bold font-poppins mb-4">Share This Article</h3>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
              Twitter
            </Button>
            <Button variant="outline" className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path>
              </svg>
              Facebook
            </Button>
            <Button variant="outline" className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
              YouTube
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
