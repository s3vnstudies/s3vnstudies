import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl: string;
  imageAlt: string;
}

export default function HeroSection({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  imageUrl,
  imageAlt,
}: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-r from-primary to-secondary clip-path-slant relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-white mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-bold leading-tight mb-4">
              {title}
            </h1>
            <p className="text-xl opacity-90 mb-8">{description}</p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href={primaryButtonLink}>
                <Button 
                  className="bg-white text-primary font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:shadow-xl transition-shadow"
                  size="lg"
                >
                  {primaryButtonText}
                </Button>
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link href={secondaryButtonLink}>
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-2 border-white text-white font-montserrat font-semibold text-lg px-8 py-6 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
                    size="lg"
                  >
                    {secondaryButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-full bg-opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary rounded-full bg-opacity-60 animate-pulse delay-150"></div>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-auto rounded-xl shadow-2xl relative z-10"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-light-100"></div>
    </section>
  );
}
