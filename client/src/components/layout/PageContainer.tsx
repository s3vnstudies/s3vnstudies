import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-grow ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}
