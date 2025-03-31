import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would be a proper API call
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You have been subscribed to our newsletter.",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter to receive the latest updates, articles, and exclusive content straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none"
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-blue-100 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
