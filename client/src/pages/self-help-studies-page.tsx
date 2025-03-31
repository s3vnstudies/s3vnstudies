import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import PageLayout from "@/components/layout/page-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, PlayCircle, ArrowRight } from "lucide-react";

// Types for our Self Help Studies content
interface StudyResource {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string; // Intro video URL
  isPremium: boolean;
}

export default function SelfHelpStudiesPage() {
  const { user } = useAuth();
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  
  // Self-help studies resources
  const selfHelpStudies: StudyResource[] = [
    {
      id: "mind-reset",
      title: "GOLD Mind Reset",
      description: "Discover mindset techniques that will help you break through self-limiting beliefs, build confidence, and develop a positive mindset to achieve success.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/mind-rest-videos.jpg",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video01.mp4", // Free intro video
      isPremium: false // Making the intro video free
    },
    {
      id: "self-limiting-beliefs",
      title: "Self-Limiting Beliefs",
      description: "Learn about 3 self-limiting beliefs that are holding you back from achieving success and how to overcome them.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/feature-1.png",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video01.mp4",
      isPremium: true
    },
    {
      id: "confidence-training",
      title: "Training Your Confidence",
      description: "Discover 3 things that are training your confidence and how to leverage them for personal growth.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/feature-2.png",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video02.mp4",
      isPremium: true
    },
    {
      id: "positive-thinking",
      title: "Negative to Positive Thoughts",
      description: "Master 3 powerful tricks to instantly turn negative thoughts into positive thoughts for a healthier mindset.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/feature-3.png",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video03.mp4",
      isPremium: true
    },
    {
      id: "self-esteem-boost",
      title: "Boost Your Self-Esteem",
      description: "Learn 5 powerful mantras that will boost your self-esteem and transform your self-perception.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/feature-4.png",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video04.mp4",
      isPremium: true
    },
    {
      id: "morning-mindset",
      title: "Morning Mindset Rituals",
      description: "Discover 5 morning mindset rituals that will help you win the day and set yourself up for success.",
      thumbnail: "/courses/flask-course/GOLD-Mind-Reset/Module 10 - Feature Images/Images/feature-5.png",
      videoUrl: "/courses/flask-course/GOLD-Mind-Reset/Module 1 - Videos/video06.mp4", // Skipping video05 as the filename suggests it might be problematic
      isPremium: true
    }
  ];

  useEffect(() => {
    document.title = "Self Help Studies - S3vn Studies";
  }, []);

  const handleResourceSelect = (resource: StudyResource) => {
    setSelectedResource(resource);
    // Scroll to video section
    document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold font-poppins tracking-tight mb-4">
              Self Help Studies
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Improve your skills, knowledge, and life with our curated self-help resources
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button className="rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-6">
                    Sign Up for Full Access
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-poppins text-center mb-12">Available Resources</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {selfHelpStudies.map((resource) => (
              <Card 
                key={resource.id} 
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={resource.thumbnail} 
                    alt={resource.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  {resource.isPremium && !user && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/70 text-white px-3 py-1 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Premium
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {resource.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => handleResourceSelect(resource)}
                  >
                    <PlayCircle className="h-4 w-4" /> 
                    Watch Intro Video
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Player Section */}
      {selectedResource && (
        <section id="video-section" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">{selectedResource.title}</h2>
              
              <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-xl mb-6">
                <video
                  className="w-full h-full"
                  src={selectedResource.videoUrl}
                  title={selectedResource.title}
                  controls
                  preload="metadata"
                  poster={selectedResource.thumbnail}
                />
              </div>
              
              <p className="text-gray-600 mb-6">{selectedResource.description}</p>
              
              {!user && selectedResource.isPremium && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Get Full Access to This Resource</h3>
                    <p className="text-gray-600">Sign up for a membership to unlock the complete content.</p>
                  </div>
                  <Link href="/auth">
                    <Button className="whitespace-nowrap">
                      Join Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      {!user && (
        <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Self-Improvement Journey?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Get unlimited access to all our premium self-help resources with a membership.
            </p>
            <Link href="/auth">
              <Button variant="secondary" size="lg" className="rounded-full px-8">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </section>
      )}
    </PageLayout>
  );
}