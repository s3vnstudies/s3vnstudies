import { ReactNode } from "react";
import Header from "@/components/Header";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export default function MainLayout({ children, className = "" }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 pt-28 pb-16 px-4 sm:px-6 md:px-8 ${className}`}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-background/95 backdrop-blur-sm border-t border-border py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <img 
              src="/images/logo.gif" 
              alt="S3VN Studies Logo"
              className="h-8 mr-2"
            />
            <div>
              <p className="text-white font-semibold">S3VN<span className="text-primary">Studies</span></p>
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/about" className="text-sm text-muted-foreground hover:text-white transition-colors">About</a>
            <a href="/policies" className="text-sm text-muted-foreground hover:text-white transition-colors">Policies</a>
            <a href="/membership" className="text-sm text-muted-foreground hover:text-white transition-colors">Membership</a>
          </div>
        </div>
      </footer>
    </div>
  );
}