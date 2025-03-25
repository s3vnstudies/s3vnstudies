import { Helmet } from 'react-helmet';
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import LatestContentSection from "@/components/home/latest-content-section";
import MembershipSection from "@/components/home/membership-section";
import CommunitySection from "@/components/home/community-section";
import StoreSection from "@/components/home/store-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CtaSection from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>S3VN Studies - Learning Community for Content Creators</title>
        <meta name="description" content="Join our thriving community of learners, creators, and explorers. Get access to exclusive content, engage with like-minded members, and expand your horizons." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <LatestContentSection />
          <MembershipSection />
          <CommunitySection />
          <StoreSection />
          <TestimonialsSection />
          <CtaSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
