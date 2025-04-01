import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <Footer />
    </div>
  );
}