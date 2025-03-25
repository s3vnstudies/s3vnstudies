import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Subscription successful",
        description: "You've been added to our newsletter list",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-16 bg-neutral-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-4">Stay Connected</h2>
            <p className="text-neutral-300 mb-8">
              Get the latest updates on new content, community events, and exclusive offers directly to your inbox.
            </p>
            
            <form className="mb-8" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg bg-neutral-700 border border-neutral-600 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  className="px-6 py-3 bg-primary rounded-lg text-white font-semibold hover:bg-primary-dark transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>
            </form>

            <div className="flex items-center space-x-5">
              <a href="https://youtube.com/@s3vnstudies" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition">
                <i className="fab fa-youtube text-2xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition">
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition">
                <i className="fab fa-instagram text-2xl"></i>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition">
                <i className="fab fa-discord text-2xl"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-primary transition">
                <i className="fab fa-facebook text-2xl"></i>
              </a>
            </div>
          </div>

          <Card className="bg-neutral-900 rounded-xl">
            <CardContent className="p-8">
              <h3 className="font-heading text-xl font-bold mb-6">Upcoming Events</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-primary-dark rounded-lg p-3 text-center w-16">
                    <div className="text-xl font-bold">15</div>
                    <div className="text-xs">June</div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Live Q&A Session</h4>
                    <p className="text-neutral-400 text-sm mb-2">Interactive session answering your most pressing questions.</p>
                    <div className="flex items-center text-xs text-neutral-500">
                      <span className="flex items-center"><i className="far fa-clock mr-1"></i> 2:00 PM EST</span>
                      <span className="mx-2">•</span>
                      <span>Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-secondary-dark rounded-lg p-3 text-center w-16">
                    <div className="text-xl font-bold">22</div>
                    <div className="text-xs">June</div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Workshop: Creative Problem Solving</h4>
                    <p className="text-neutral-400 text-sm mb-2">Learn techniques to approach problems from new angles.</p>
                    <div className="flex items-center text-xs text-neutral-500">
                      <span className="flex items-center"><i className="far fa-clock mr-1"></i> 1:00 PM EST</span>
                      <span className="mx-2">•</span>
                      <span>Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 bg-accent-dark rounded-lg p-3 text-center w-16">
                    <div className="text-xl font-bold">30</div>
                    <div className="text-xs">June</div>
                  </div>
                  <div>
                    <h4 className="font-heading font-bold mb-1">Premium Member Meetup</h4>
                    <p className="text-neutral-400 text-sm mb-2">Exclusive networking event for premium members.</p>
                    <div className="flex items-center text-xs text-neutral-500">
                      <span className="flex items-center"><i className="far fa-clock mr-1"></i> 7:00 PM EST</span>
                      <span className="mx-2">•</span>
                      <span>Premium Members Only</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
