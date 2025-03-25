import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import ContentCard from "@/components/ContentCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Article, Video } from "@shared/schema";
import { 
  Video as VideoIcon, 
  Users, 
  FileText, 
  ArrowRight,
  Play,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"videos" | "articles">("videos");
  
  // Fetch featured articles
  const { 
    data: articles = [], 
    isLoading: isLoadingArticles,
  } = useQuery<Article[]>({
    queryKey: ["/api/articles/featured"],
  });
  
  // Fetch videos
  const { 
    data: videos = [], 
    isLoading: isLoadingVideos,
  } = useQuery<Video[]>({
    queryKey: ["/api/videos", { limit: 3 }],
  });
  
  const features = [
    {
      icon: <VideoIcon className="text-white text-2xl" />,
      title: "Exclusive Videos",
      description: "Access premium videos and tutorials not available on our public YouTube channel."
    },
    {
      icon: <Users className="text-white text-2xl" />,
      title: "Community Access",
      description: "Join our thriving community of like-minded individuals in topic-based chat rooms."
    },
    {
      icon: <FileText className="text-white text-2xl" />,
      title: "In-Depth Articles",
      description: "Read comprehensive articles and guides on a variety of engaging topics."
    }
  ];
  
  const testimonials = [
    {
      quote: "The content and community here have been instrumental in helping me develop my skills. The premium tutorials are well worth the subscription, and the community is incredibly supportive.",
      authorName: "Jessica Martinez",
      authorImage: "https://randomuser.me/api/portraits/women/28.jpg",
      authorInfo: "Premium Member, 1 year",
      rating: 5
    },
    {
      quote: "I've been a member for six months, and the quality of content keeps improving. The chat rooms have connected me with other creators who have become collaborators on various projects.",
      authorName: "Michael Thompson",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      authorInfo: "Basic Member, 6 months",
      rating: 4.5
    },
    {
      quote: "The exclusive tutorials and community access have been game-changing for my creative journey. I appreciate the attention to detail and the responsiveness of the team to community feedback.",
      authorName: "Sophia Rodriguez",
      authorImage: "https://randomuser.me/api/portraits/women/64.jpg",
      authorInfo: "Pro Member, 2 years",
      rating: 5
    }
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection 
        title="Discover a World of Knowledge & Connection"
        description="Join our thriving community of learners, creators, and explorers. Get access to exclusive content, engage with like-minded members, and expand your horizons."
        primaryButtonText="Become a Member"
        primaryButtonLink="/membership"
        secondaryButtonText="Watch Videos"
        secondaryButtonLink="/videos"
        imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        imageAlt="Community of content consumers"
      />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">What We Offer</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Explore our diverse range of content and community features designed to enrich your experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <Link href="/about">
              <Button variant="outline" className="font-montserrat px-6 py-3 rounded-full border border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors flex items-center">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Latest Content Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-2">Latest Content</h2>
              <p className="text-lg text-slate-700 opacity-80">Fresh videos and articles from our creators</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button 
                onClick={() => setActiveTab("videos")}
                variant={activeTab === "videos" ? "default" : "outline"}
                className={`px-5 py-2 rounded-full ${activeTab === "videos" ? "bg-primary text-white" : "bg-white text-slate-800"}`}
              >
                Videos
              </Button>
              <Button 
                onClick={() => setActiveTab("articles")}
                variant={activeTab === "articles" ? "default" : "outline"}
                className={`px-5 py-2 rounded-full ${activeTab === "articles" ? "bg-primary text-white" : "bg-white text-slate-800"}`}
              >
                Articles
              </Button>
            </div>
          </div>
          
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingVideos ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-slate-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : videos.length === 0 ? (
                <div className="col-span-3 text-center py-10">
                  <p className="text-slate-500">No videos available at the moment.</p>
                </div>
              ) : (
                videos.map((video) => (
                  <ContentCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    description={video.description || ""}
                    imageUrl={video.thumbnailUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    type="video"
                    date={video.publishedAt || video.createdAt}
                    isPremium={video.isPremium}
                    duration={video.duration}
                    link={`/videos/${video.id}`}
                  />
                ))
              )}
            </div>
          )}
          
          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingArticles ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-slate-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : articles.length === 0 ? (
                <div className="col-span-3 text-center py-10">
                  <p className="text-slate-500">No articles available at the moment.</p>
                </div>
              ) : (
                articles.map((article) => (
                  <ContentCard
                    key={article.id}
                    id={article.id}
                    title={article.title}
                    description={article.excerpt}
                    imageUrl={article.imageUrl || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                    type="article"
                    category={article.category}
                    date={article.createdAt}
                    isPremium={article.isPremium}
                    link={`/articles/${article.id}`}
                  />
                ))
              )}
            </div>
          )}
          
          <div className="mt-12 flex justify-center">
            <Link href={activeTab === "videos" ? "/videos" : "/articles"}>
              <Button className="font-montserrat px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-shadow flex items-center">
                View All {activeTab === "videos" ? "Videos" : "Articles"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">What Our Members Say</h2>
            <p className="text-lg text-slate-700 opacity-80 max-w-2xl mx-auto">
              Hear from our community members about their experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                authorName={testimonial.authorName}
                authorImage={testimonial.authorImage}
                authorInfo={testimonial.authorInfo}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Get exclusive access to premium content, connect with like-minded creators, and take your skills to the next level.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link href="/membership">
              <Button 
                className="bg-white text-primary font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:shadow-xl transition-shadow"
                size="lg"
              >
                Become a Member
              </Button>
            </Link>
            <Link href="/videos">
              <Button 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
                size="lg"
              >
                Explore Content
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
