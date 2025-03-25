import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import MobileMenu from "./mobile-menu";
import LoginModal from "./login-modal";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { cartItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const isActiveLink = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-90 shadow-md z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                S3
              </div>
              <span className="ml-2 text-xl font-poppins font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                S3VN Studies
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <a className={`font-medium ${isActiveLink("/") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className={`font-medium ${isActiveLink("/about") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                About
              </a>
            </Link>
            <Link href="/articles">
              <a className={`font-medium ${isActiveLink("/articles") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                Articles
              </a>
            </Link>
            <Link href="/videos">
              <a className={`font-medium ${isActiveLink("/videos") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                Videos
              </a>
            </Link>
            <Link href="/community">
              <a className={`font-medium ${isActiveLink("/community") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                Community
              </a>
            </Link>
            <Link href="/store">
              <a className={`font-medium ${isActiveLink("/store") ? "text-primary" : "hover:text-primary"} transition-colors`}>
                Store
              </a>
            </Link>
            <Link href="/membership">
              <a className="font-montserrat px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-lg transition-shadow">
                Join Now
              </a>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-800 hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/store/cart">
              <a className="text-gray-800 hover:text-primary transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemsCount}
                  </span>
                )}
              </a>
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.username} />
                      <AvatarFallback className="bg-primary text-white">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <a className="flex items-center cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex items-center cursor-pointer">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin</span>
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/membership">
                      <a className="flex items-center cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Subscription</span>
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button 
                onClick={() => setLoginModalOpen(true)}
                className="text-gray-800 hover:text-primary transition-colors"
              >
                <User className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        onLoginClick={() => {
          setMobileMenuOpen(false);
          setLoginModalOpen(true);
        }}
      />
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  );
}
