import { useEffect } from "react";
import PageLayout from "@/components/layout/page-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutPage() {
  // Set page title
  useEffect(() => {
    document.title = "About - S3vn Studies";
  }, []);

  return (
    <PageLayout>
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-4">About S3vn Studies</h1>
          <p className="text-lg opacity-90">
            Discover our mission, vision, and the story behind our community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h2 className="text-2xl font-bold font-poppins mb-4 text-foreground">Our Story</h2>
            <p className="text-foreground/90 mb-4">
              S3vn Studies was founded with a simple yet powerful idea: to create a space where curious minds could
              connect, learn, and grow together. What started as a small YouTube channel has evolved into a thriving
              community of knowledge seekers from around the world.
            </p>
            <p className="text-foreground/90">
              We believe in the transformative power of continuous learning and meaningful connections. Our platform
              is designed to foster both, providing high-quality educational content alongside vibrant community features.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
              alt="S3vn Studies founder"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-poppins mb-4 text-foreground">Our Mission</h2>
          <p className="text-foreground/90 mb-4">
            At S3vn Studies, our mission is to make high-quality educational content accessible to everyone while
            building a supportive community where members can share ideas, collaborate, and inspire each other.
          </p>
          <p className="text-foreground/90">
            We strive to create content that not only informs but also encourages critical thinking and personal growth.
            Through our videos, articles, and community discussions, we aim to spark curiosity and foster a lifelong
            love of learning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg border border-border/40">
            <h3 className="text-xl font-bold font-poppins mb-3 text-foreground">Quality Content</h3>
            <p className="text-foreground/90">
              We are committed to producing thoughtful, well-researched content that provides genuine value to our
              community members.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/40">
            <h3 className="text-xl font-bold font-poppins mb-3 text-foreground">Inclusive Community</h3>
            <p className="text-foreground/90">
              We welcome diverse perspectives and believe that the best learning happens when people from different
              backgrounds share their experiences and ideas.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/40">
            <h3 className="text-xl font-bold font-poppins mb-3 text-foreground">Continuous Growth</h3>
            <p className="text-foreground/90">
              We are constantly evolving, improving our platform, and expanding our content library to better serve
              our community's needs.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold font-poppins mb-4 text-foreground">Meet the Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="/images/team/matthew-lepley-original.jpg"
                  alt="Matthew Lepley"
                  className="w-full h-full object-cover object-top"
                  style={{ objectPosition: "center 15%" }}
                />
              </div>
              <h3 className="text-lg font-bold font-poppins text-foreground">Matthew Lepley</h3>
              <p className="text-foreground/80">Founder & Content Creator</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Community Manager"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold font-poppins text-foreground">Jane Smith</h3>
              <p className="text-foreground/80">Community Manager</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Content Researcher"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold font-poppins text-foreground">Michael Johnson</h3>
              <p className="text-foreground/80">Content Researcher</p>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold font-poppins mb-4 text-foreground">Contact Us</h2>
          <p className="text-foreground/90 mb-6 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you! Reach out to us at
            <a href="mailto:contact@s3vnstudies.com" className="text-primary font-medium ml-1">
              contact@s3vnstudies.com
            </a>
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="outline">
              <a
                href="https://youtube.com/@s3vnstudies"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </Button>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg text-center border border-border/40">
          <h2 className="text-2xl font-bold font-poppins mb-4 text-foreground">
            Join Our Community Today
          </h2>
          <p className="text-foreground/90 mb-6 max-w-2xl mx-auto">
            Become part of the S3vn Studies community and start your journey of continuous learning and connection.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
