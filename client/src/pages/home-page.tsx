import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import HeroSection from "@/components/home/hero-section";
import FeaturedSections from "@/components/home/featured-sections";
import FeaturedSelfHelp from "@/components/home/featured-self-help";
import MembershipTiers from "@/components/home/membership-tiers";
import StorePreview from "@/components/home/store-preview";
import CallToAction from "@/components/home/call-to-action";

export default function HomePage() {
  // Set page title
  useEffect(() => {
    document.title = "S3vn Studies - Transformative Self-Improvement Resources";
  }, []);

  return (
    <PageLayout>
      <HeroSection />
      <FeaturedSections />
      <FeaturedSelfHelp />
      <MembershipTiers />
      <StorePreview />
      <CallToAction />
    </PageLayout>
  );
}
