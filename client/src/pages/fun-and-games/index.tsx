import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/page-layout";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SunIcon, TreePine as TreesIcon, Flower as ParkIcon, LockIcon } from "lucide-react";

const sections = [
  {
    title: "Backyard Activities",
    description: "Discover outdoor fun ideas, family-friendly games, and educational backyard adventures.",
    icon: SunIcon,
    path: "/fun-and-games/backyard",
    isPremium: true
  },
  {
    title: "Nature Exploration",
    description: "Guides for exploring the natural world with your family and friends.",
    icon: TreesIcon,
    path: "/fun-and-games/nature",
    comingSoon: true
  },
  {
    title: "Park Adventures",
    description: "Tips and ideas for making the most of your local park visits.",
    icon: ParkIcon,
    path: "/fun-and-games/parks",
    comingSoon: true
  }
];

export default function FunAndGamesPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isPremiumMember = user?.membershipTier === "pro";

  return (
    <PageLayout>
      <div className="container py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Fun & Games</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore a variety of recreational activities and games curated by S3vn Studies.
            From backyard fun to nature exploration, there's something for everyone!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4">
                  <section.icon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
                <p className="text-muted-foreground mb-6 flex-grow">{section.description}</p>
                
                {section.comingSoon ? (
                  <Button variant="outline" disabled className="w-full">
                    Coming Soon
                  </Button>
                ) : section.isPremium && !isPremiumMember ? (
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/membership")}
                    className="w-full"
                  >
                    <LockIcon className="mr-2 h-4 w-4" />
                    Premium Content
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(section.path)}
                    className="w-full"
                  >
                    Explore
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}