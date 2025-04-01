import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import HeroSection from "@/components/home/hero-section";
import FeaturedContent from "@/components/home/featured-content";
import MembershipTiers from "@/components/home/membership-tiers";
import FeaturedVideos from "@/components/home/featured-videos";
import StorePreview from "@/components/home/store-preview";
import CommunitySection from "@/components/home/community-section";
import CategoryNavigation from "@/components/home/category-navigation";
import CallToAction from "@/components/home/call-to-action";

export default function HomePage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Learn, Connect, and Grow";
  }, []);

  return (
    <PageLayout>
      <HeroSection />
      <FeaturedContent />
      <MembershipTiers />
      <FeaturedVideos />
      <StorePreview />
      <CommunitySection />
      <CategoryNavigation />
      <CallToAction />
    </PageLayout>
  );
}
