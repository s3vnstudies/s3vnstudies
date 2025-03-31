import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import CartDropdown from "@/components/shop/cart-dropdown";
import UserMenu from "@/components/profile/user-menu";
import MobileMenu from "@/components/layout/mobile-menu";
import LoginModal from "@/components/layout/login-modal";
import SignupModal from "@/components/layout/signup-modal";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user } = useAuth();
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Track scroll position to add shadow to header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if current route is active
  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className={`bg-white sticky top-0 z-50 ${isScrolled ? "shadow-sm" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={ROUTES.HOME} className="flex items-center">
                <span className="text-primary text-2xl font-accent font-bold">S3VN</span>
                <span className="text-dark text-xl ml-1 font-semibold">Studies</span>
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-6">
              <Link href={ROUTES.HOME} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.HOME) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                Home
              </Link>
              <Link href={ROUTES.ABOUT} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.ABOUT) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                About
              </Link>
              <Link href={ROUTES.ARTICLES} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.ARTICLES) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                Articles
              </Link>
              <Link href={ROUTES.VIDEOS} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.VIDEOS) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                Videos
              </Link>
              <Link href={ROUTES.STORE} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.STORE) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                Store
              </Link>
              <Link href={ROUTES.COMMUNITY} 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium 
                  ${isActive(ROUTES.COMMUNITY) 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-gray-600 hover:text-primary border-b-2 border-transparent hover:border-secondary"
                  }`}>
                Community
              </Link>
            </nav>
          </div>
          
          {/* User controls */}
          <div className="flex items-center">
            <div className="relative">
              <button 
                onClick={() => setCartOpen(!cartOpen)}
                className="p-2 text-gray-500 hover:text-primary mr-1 relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              {cartOpen && <CartDropdown onClose={() => setCartOpen(false)} />}
            </div>
            
            {/* Login buttons (when not logged in) */}
            {!user && (
              <div className="hidden md:block">
                <Button 
                  variant="default" 
                  onClick={() => setLoginModalOpen(true)} 
                  className="mr-2"
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSignupModalOpen(true)}
                >
                  Sign Up
                </Button>
              </div>
            )}
            
            {/* User menu (when logged in) */}
            {user && <UserMenu user={user} />}
            
            {/* Mobile menu button */}
            <MobileMenu user={user} 
              onLogin={() => setLoginModalOpen(true)} 
              onSignup={() => setSignupModalOpen(true)} 
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
        onSignupClick={() => {
          setLoginModalOpen(false);
          setSignupModalOpen(true);
        }} 
      />
      
      <SignupModal 
        isOpen={signupModalOpen} 
        onClose={() => setSignupModalOpen(false)} 
        onLoginClick={() => {
          setSignupModalOpen(false);
          setLoginModalOpen(true);
        }} 
      />
    </header>
  );
}
