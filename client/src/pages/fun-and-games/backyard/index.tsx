import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LockIcon, ExternalLink } from "lucide-react";
import { Link, useLocation } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const articles = [
  "Planning a Pool Party",
  "Popular Backyard Activities for Adults",
  "Popular Backyard Activities for Teens",
  "Popular Backyard Activities for Toddlers",
  "Popular Water Activities for the Backyard",
  "Sunbathing: A Relaxing Backyard Activity",
  "The Benefits of Taking Your Child Outdoors",
  "Backyard Play Structures for Children",
  "Building a Tree House or Fort",
  "Exploring Nature with Your Child",
  "Family-Friendly Backyard Accessories",
  "Great Backyard Snacks for Children",
  "Own a Pool? Have a Pool Party!",
  "Planning a Backyard Barbeque Party",
  "Planning a Backyard Campout",
];

export default function BackyardLandingPage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isPremiumMember = user?.membershipTier === "pro";

  return (
    <PageLayout>
      <div className="container py-12 max-w-5xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Backyard Activities</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover a curated selection of outdoor fun ideas, family-friendly games, and 
            educational backyard adventures—exclusively from <strong>S3vn Studies</strong>.
          </p>
        </div>

        {!isPremiumMember && (
          <Alert className="mb-8 border-primary/50 bg-primary/10">
            <LockIcon className="h-4 w-4" />
            <AlertTitle>Premium Content</AlertTitle>
            <AlertDescription>
              This content is available exclusively to Pro members. 
              <Link href="/membership">
                <Button variant="link" className="p-0 h-auto mb-2 ml-2">
                  Upgrade now
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((title) => {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return (
              <Card key={slug} className={`hover:shadow-lg transition-shadow ${!isPremiumMember ? 'opacity-75' : ''}`}>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">{title}</h2>
                  {isPremiumMember ? (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/fun-and-games/backyard/${slug}`)}
                      className="w-full"
                    >
                      Read Article
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/membership")}
                      className="w-full"
                    >
                      <LockIcon className="mr-2 h-4 w-4" />
                      Unlock Content
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}