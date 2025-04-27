import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import PageLayout from "@/components/layout/page-layout";
import { queryClient } from "@/lib/queryClient";

export default function SubscriptionSuccess() {
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    document.title = "Subscription Success - S3vn Studies";
    
    // Invalidate user data to refresh the membership status
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl mx-auto py-16 px-4">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Thank You for Subscribing!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Your Pro membership has been activated. You now have full access to all premium content and features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <a href="/articles">Browse Premium Articles</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="/profile">View Your Profile</a>
            </Button>
          </div>
          
          <div className="mt-12 p-6 bg-neutral-50 rounded-lg max-w-xl mx-auto">
            <h2 className="font-bold text-lg mb-3">What's Next?</h2>
            <ul className="text-left space-y-2 text-muted-foreground">
              <li>Explore all premium articles across every category</li>
              <li>Join our exclusive Pro member chat rooms</li>
              <li>Customize your profile with enhanced features</li>
              <li>Share and upload your own content with the community</li>
              <li>Participate in upcoming member-only events</li>
            </ul>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}