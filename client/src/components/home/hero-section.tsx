import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-primary">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-poppins leading-tight">
              Learn, Connect, and Grow with S3vn Studies
            </h1>
            <p className="mt-4 text-lg opacity-90 max-w-md">
              Join our community of curious minds exploring knowledge, sharing ideas, and building connections.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                asChild
                size="lg" 
                className="bg-accent hover:bg-accent-dark text-white"
              >
                <Link href="/membership">
                  Join Membership
                </Link>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline" 
                className="bg-white text-primary hover:bg-neutral-100"
              >
                <Link href="/videos">
                  Watch Videos
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Community learning together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
