import { useState } from "react";
import { Link } from "wouter";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logoutMutation } = useAuth();
  const [contentExpanded, setContentExpanded] = useState(false);
  const [communityExpanded, setCommunityExpanded] = useState(false);

  const toggleContent = () => {
    setContentExpanded(!contentExpanded);
  };

  const toggleCommunity = () => {
    setCommunityExpanded(!communityExpanded);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader className="text-left font-heading text-xl font-bold text-primary mb-4">
          S3VN <span className="text-cyan-500">Studies</span>
        </SheetHeader>
        
        <div className="py-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 w-full"
            />
          </div>
          
          <nav className="space-y-1">
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={toggleContent}
              >
                Content
                {contentExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {contentExpanded && (
                <div className="pl-4 pt-1 pb-2 space-y-1">
                  <Link href="/articles" onClick={onClose}>
                    <Button variant="ghost" className="w-full justify-start">Articles</Button>
                  </Link>
                  <Link href="/videos" onClick={onClose}>
                    <Button variant="ghost" className="w-full justify-start">Videos</Button>
                  </Link>
                </div>
              )}
            </div>
            
            <div>
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={toggleCommunity}
              >
                Community
                {communityExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {communityExpanded && (
                <div className="pl-4 pt-1 pb-2 space-y-1">
                  <Link href="/chat" onClick={onClose}>
                    <Button variant="ghost" className="w-full justify-start">Chat Rooms</Button>
                  </Link>
                  <Link href="/bulletin" onClick={onClose}>
                    <Button variant="ghost" className="w-full justify-start">Bulletin Board</Button>
                  </Link>
                  <Link href="/games" onClick={onClose}>
                    <Button variant="ghost" className="w-full justify-start">Fun & Games</Button>
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/store" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start">Store</Button>
            </Link>
            
            <Link href="/about" onClick={onClose}>
              <Button variant="ghost" className="w-full justify-start">About</Button>
            </Link>
            
            {user ? (
              <>
                <Link href="/profile" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">My Profile</Button>
                </Link>
                <Link href="/cart" onClick={onClose}>
                  <Button variant="ghost" className="w-full justify-start">Cart</Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="pt-4 space-y-2">
                <Link href="/auth" onClick={onClose}>
                  <Button className="w-full">Login</Button>
                </Link>
                <Link href="/auth?register=true" onClick={onClose}>
                  <Button variant="outline" className="w-full">Join Now</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
