import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="z-10">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Discover. Learn. <span className="text-purple-500">Connect.</span>
            </h1>
            <p className="text-lg mb-8 text-gray-300 max-w-lg">
              Join our growing community of curious minds. Get exclusive content, connect with like-minded individuals, and elevate your knowledge.
            </p>
            <div className="flex flex-wrap gap-4">
              {!user ? (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth">Become a Member</Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/profile">Your Dashboard</Link>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="bg-white hover:bg-gray-100 text-gray-900">
                <Link href="/#featured">Explore Content</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center text-sm">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-600 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-70"></div>
                  </div>
                ))}
              </div>
              <span className="text-gray-300">Join <span className="font-medium text-white">2,000+</span> members already in our community</span>
            </div>
          </div>
          <div className="relative z-10 md:flex justify-end hidden">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-14 -left-14 w-64 h-64 bg-purple-500/30 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full filter blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-2xl">
                <div className="w-full h-80 bg-gradient-to-r from-blue-600 to-purple-600 opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-300"></div>
                    <div>
                      <h4 className="font-medium">Latest Episode</h4>
                      <p className="text-sm text-gray-300">With Alex Johnson</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">The Future of AI: What's Next?</h3>
                  <div className="flex items-center text-sm">
                    <span className="mr-3 flex items-center"><i className="fas fa-eye mr-1"></i> 1.2K</span>
                    <span className="mr-3 flex items-center"><i className="fas fa-comment mr-1"></i> 58</span>
                    <span className="flex items-center"><i className="fas fa-heart mr-1"></i> 324</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-900/50"></div>
      <div className="absolute inset-0 opacity-40 bg-gray-900">
        {/* Background overlay */}
      </div>
    </section>
  );
};

export default Hero;
