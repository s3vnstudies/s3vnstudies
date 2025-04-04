import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  User,
  LogOut,
  Book,
  Video,
  Store,
  Users,
  Star,
  PenTool,
  Heart,
  Clock,
  Settings,
} from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Articles", path: "/articles" },
    { name: "Videos", path: "/videos" },
    { name: "Community", path: "/community" },
    { name: "Self Help Studies", path: "/self-help-studies" },
    { name: "Store", path: "/store" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 border-b border-border/40 shadow-md z-50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3">
        {/* Logo and Brand Name */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img 
              src="/static/images/logo.gif" 
              alt="S3VN Studies Logo"
              className="h-10 mr-2" 
            />
            <span className="text-2xl font-bold text-white">
              S3VN<span className="text-primary">Studies</span>
            </span>
          </Link>
          
          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex mx-4 flex-1 max-w-md relative"
          >
            <Input
              type="search"
              placeholder="Search articles..."
              className="bg-muted/50 border-muted text-white placeholder:text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-0 top-0 bottom-0 rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Desktop Nav Links */}
          {!user ? (
            <div className="flex items-center space-x-2">
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth?signup=true">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback>
                        {getInitials(user.displayName || user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || ""} />
                      <AvatarFallback>
                        {getInitials(user.displayName || user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.displayName || user.username}</span>
                      <span className="text-xs text-muted-foreground">{user.membershipTier === "pro" ? "Pro Member" : "Free Member"}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  {user.isAdmin && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center justify-center mt-2 space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`font-medium text-sm transition-colors ${
                isActive(link.path)
                  ? "text-primary"
                  : "text-white hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden absolute right-4 top-4">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background/95 backdrop-blur-md border-r border-border">
            <div className="flex flex-col gap-6 py-4">
              <Link
                href="/"
                className="flex items-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <img 
                  src="/static/images/logo.gif" 
                  alt="S3VN Studies Logo"
                  className="h-10 mr-2"
                />
                <span className="text-2xl font-bold text-white">
                  S3VN<span className="text-primary">Studies</span>
                </span>
              </Link>
              
              <form 
                onSubmit={handleSearch}
                className="relative"
              >
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="bg-muted/50 border-muted text-white placeholder:text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-0 top-0 bottom-0 rounded-l-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
              
              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  // Define icons for each link
                  let icon;
                  switch(link.name) {
                    case "Articles":
                      icon = <Book className="h-4 w-4 mr-2" />;
                      break;
                    case "Videos":
                      icon = <Video className="h-4 w-4 mr-2" />;
                      break;
                    case "Community":
                      icon = <Users className="h-4 w-4 mr-2" />;
                      break;
                    case "Self Help Studies":
                      icon = <PenTool className="h-4 w-4 mr-2" />;
                      break;
                    case "Store":
                      icon = <Store className="h-4 w-4 mr-2" />;
                      break;
                    default:
                      icon = <Star className="h-4 w-4 mr-2" />;
                  }
                  
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      className={`flex items-center py-2 px-3 rounded-md transition-colors ${
                        isActive(link.path)
                          ? "bg-primary/20 text-primary"
                          : "text-white hover:bg-muted/20"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {icon}
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
              
              <div className="mt-auto pt-4 border-t border-border">
                {user ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3 p-3 rounded-md bg-muted/30">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl || ""} />
                        <AvatarFallback>
                          {getInitials(user.displayName || user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.membershipTier === "pro" ? "Pro Member" : "Free Member"}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-1 mb-2">
                      <Link 
                        href="/profile" 
                        className="flex items-center py-2 px-3 rounded-md text-white hover:bg-muted/20"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      {user.isAdmin && (
                        <Link 
                          href="/admin" 
                          className="flex items-center py-2 px-3 rounded-md text-white hover:bg-muted/20"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/auth?signup=true" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
