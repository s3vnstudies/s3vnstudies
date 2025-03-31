import Hero from "@/components/home/Hero";
import FeaturedContent from "@/components/home/FeaturedContent";
import MembershipPlans from "@/components/home/MembershipPlans";
import CommunitySection from "@/components/home/CommunitySection";
import StorePreview from "@/components/home/StorePreview";
import VideoSection from "@/components/home/VideoSection";
import Newsletter from "@/components/home/Newsletter";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <FeaturedContent />
      <MembershipPlans />
      <CommunitySection />
      <StorePreview />
      <VideoSection />
      <Newsletter />
    </div>
  );
};

export default HomePage;
