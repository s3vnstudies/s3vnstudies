import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary/90 to-secondary/80 text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Join the S3VN Studies Community</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">Access exclusive content, join discussions, and connect with like-minded people in our growing community.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/membership">
              <a>
                <Button 
                  className="px-6 py-3 bg-white text-primary font-semibold rounded-md hover:bg-neutral-100 transition"
                >
                  Join Membership
                </Button>
              </a>
            </Link>
            <Link href="/articles">
              <a>
                <Button
                  variant="outline"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-primary transition"
                >
                  Explore Content
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
