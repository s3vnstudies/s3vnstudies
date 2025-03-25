import { useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/context/cart-context";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function MobileMenu({ isOpen, onClose, onLoginClick }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();
  const { cartItems } = useCart();
  
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  // Close the menu when the logout mutation succeeds
  useEffect(() => {
    if (logoutMutation.isSuccess) {
      onClose();
    }
  }, [logoutMutation.isSuccess, onClose]);
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[380px]">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" onClick={onClose} className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-base">
                S3
              </div>
              <span className="ml-2 text-lg font-poppins font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                S3VN Studies
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-8">
          {user && (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.avatar || undefined} alt={user.username} />
                  <AvatarFallback className="bg-primary text-white">
                    {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.displayName || user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          )}
          
          <nav className="flex flex-col space-y-3">
            <SheetClose asChild>
              <Link href="/">
                <a className="font-medium py-2 hover:text-primary transition-colors">Home</a>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/about">
                <a className="font-medium py-2 hover:text-primary transition-colors">About</a>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/articles">
                <a className="font-medium py-2 hover:text-primary transition-colors">Articles</a>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/videos">
                <a className="font-medium py-2 hover:text-primary transition-colors">Videos</a>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/community">
                <a className="font-medium py-2 hover:text-primary transition-colors">Community</a>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/store">
                <a className="font-medium py-2 hover:text-primary transition-colors">Store</a>
              </Link>
            </SheetClose>
            {user && (
              <>
                <SheetClose asChild>
                  <Link href="/profile">
                    <a className="font-medium py-2 hover:text-primary transition-colors flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </a>
                  </Link>
                </SheetClose>
                {user.role === 'admin' && (
                  <SheetClose asChild>
                    <Link href="/admin">
                      <a className="font-medium py-2 hover:text-primary transition-colors flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </a>
                    </Link>
                  </SheetClose>
                )}
                <SheetClose asChild>
                  <Link href="/membership">
                    <a className="font-medium py-2 hover:text-primary transition-colors flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Subscription
                    </a>
                  </Link>
                </SheetClose>
              </>
            )}
          </nav>
          
          <Separator className="my-4" />
          
          <div className="flex space-x-4 py-2">
            <button className="text-gray-800 hover:text-primary transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <SheetClose asChild>
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
            </SheetClose>
          </div>
          
          <div className="mt-8">
            {user ? (
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <>
                <SheetClose asChild>
                  <Button 
                    className="w-full mb-3" 
                    onClick={onLoginClick}
                  >
                    Sign In
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/membership">
                    <a className="font-montserrat w-full px-4 py-2 rounded-full bg-gradient-to-r from-primary to-secondary text-center text-white font-medium hover:shadow-lg transition-shadow block">
                      Join Now
                    </a>
                  </Link>
                </SheetClose>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
