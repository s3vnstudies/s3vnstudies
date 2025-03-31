import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins text-white max-w-3xl mx-auto leading-tight">
          Ready to join our growing community of knowledge seekers?
        </h2>
        <p className="mt-4 text-white/80 max-w-2xl mx-auto">
          Get access to exclusive content, connect with like-minded individuals, and be part of something meaningful.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            asChild
            size="lg"
            className="px-8 py-3 bg-white hover:bg-neutral-100 text-primary rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <Link href={user ? "/membership" : "/auth"}>
              Join Now
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-8 py-3 border border-white/30 hover:bg-white/10 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <Link href="/about">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
