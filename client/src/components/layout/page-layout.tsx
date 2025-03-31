import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  withoutFooter?: boolean;
}

export default function PageLayout({ children, withoutFooter = false }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {!withoutFooter && <Footer />}
    </div>
  );
}
