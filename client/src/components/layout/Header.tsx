import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import MobileMenu from "./MobileMenu";
import { ShoppingCart, Bell, User, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Placeholder for cart and notifications counts
  // In a real app, these would come from hooks or store
  const cartCount = 0;
  const notificationCount = 0;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Articles", path: "/articles" },
    { label: "Videos", path: "/videos" },
    { label: "Store", path: "/store" },
    { label: "Community", path: "/community" }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">S3</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">S3vn Studies</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium ${
                  location === link.path
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600 transition-colors"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Shopping Cart */}
            <Link href="/checkout" className="relative p-2 text-gray-600 hover:text-blue-600">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
                  {cartCount}
                </Badge>
              )}
            </Link>
            
            {/* Notifications - Only show if logged in */}
            {user && (
              <div className="relative p-2 text-gray-600 hover:text-blue-600">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center">
                    {notificationCount}
                  </Badge>
                )}
              </div>
            )}
            
            {/* User Menu when logged in */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.username} />
                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline-block font-medium">{user.username}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Your Profile</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/chat">Chat Rooms</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth" className="text-blue-600 font-medium">
                  Login
                </Link>
                <Button asChild>
                  <Link href="/auth">Join Now</Link>
                </Button>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        navLinks={navLinks}
      />
    </header>
  );
};

export default Header;
