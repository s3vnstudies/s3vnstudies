import { useState } from "react";
import { Link, useLocation } from "wouter";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { Menu, X } from "lucide-react";

interface MobileMenuProps {
  user: User | null;
  onLogin: () => void;
  onSignup: () => void;
}

export default function MobileMenu({ user, onLogin, onSignup }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        aria-expanded={isOpen}
      >
        <span className="sr-only">{isOpen ? "Close menu" : "Open menu"}</span>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75" onClick={closeMenu}>
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-4 border-b">
              <div className="font-bold text-lg">Menu</div>
              <button onClick={closeMenu} className="p-2 text-gray-500 hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="px-2 pt-2 pb-3 space-y-1">
              <Link href={ROUTES.HOME} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.HOME)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                Home
              </Link>
              <Link href={ROUTES.ABOUT} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.ABOUT)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                About
              </Link>
              <Link href={ROUTES.ARTICLES} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.ARTICLES)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                Articles
              </Link>
              <Link href={ROUTES.VIDEOS} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.VIDEOS)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                Videos
              </Link>
              <Link href={ROUTES.STORE} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.STORE)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                Store
              </Link>
              <Link href={ROUTES.COMMUNITY} onClick={closeMenu}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(ROUTES.COMMUNITY)
                    ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                }`}>
                Community
              </Link>
              {user && user.membershipTier === "admin" && (
                <Link href={ROUTES.ADMIN} onClick={closeMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(ROUTES.ADMIN)
                      ? "bg-primary bg-opacity-10 text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary border-l-4 border-transparent"
                  }`}>
                  Admin
                </Link>
              )}
            </nav>

            {user ? (
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.username} />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{user.username}</div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <Link href={ROUTES.PROFILE(user.username)} onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary">
                  Your Profile
                </Link>
                <Link href={ROUTES.MEMBERSHIP} onClick={closeMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-primary">
                  Membership
                </Link>
              </div>
            ) : (
              <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    closeMenu();
                    onLogin();
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    closeMenu();
                    onSignup();
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
