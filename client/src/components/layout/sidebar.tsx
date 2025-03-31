import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  Users,
  Play,
  ShoppingBag,
  MessageSquare,
  FileText,
  Settings,
  Award,
  Gamepad2,
  FileQuestion,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "About", href: "/about", icon: FileQuestion },
    { name: "Articles", href: "/articles", icon: FileText },
    { name: "Videos", href: "/videos", icon: Play },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Community", href: "/community", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageSquare, requiredMembership: "free" },
    {
      name: "Membership",
      href: "/membership",
      icon: Award,
    },
    { name: "Fun & Games", href: "/fun-games", icon: Gamepad2 },
  ];

  // Admin navigation
  const adminNav = [{ name: "Admin", href: "/admin", icon: Settings }];

  return (
    <div
      className={cn(
        "h-screen sticky top-0 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <Link href="/" className="flex items-center flex-1">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-sm">S7</span>
            </div>
            <span className="ml-2 text-base font-semibold text-sidebar-foreground font-poppins">
              S3vn Studies
            </span>
          </Link>
        )}
        {collapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-poppins font-bold text-sm">S7</span>
            </div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            // Skip items that require membership if user isn't logged in
            if (item.requiredMembership && !user) {
              return null;
            }

            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    location === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                      location === item.href && "text-sidebar-accent-foreground",
                      "h-5 w-5 mr-3"
                    )}
                    aria-hidden="true"
                  />
                  {!collapsed && <span>{item.name}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {user && user.id === 1 && (
          <div className="pt-6 mt-6 border-t border-sidebar-border">
            <h3
              className={cn(
                "px-4 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider",
                collapsed && "text-center"
              )}
            >
              {!collapsed ? "Administration" : "Admin"}
            </h3>
            <nav className="mt-2 px-2 space-y-1">
              {adminNav.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                      location === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "text-sidebar-foreground group-hover:text-sidebar-accent-foreground",
                        location === item.href && "text-sidebar-accent-foreground",
                        "h-5 w-5 mr-3"
                      )}
                      aria-hidden="true"
                    />
                    {!collapsed && <span>{item.name}</span>}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>

      {user && !collapsed && (
        <div className="p-4 border-t border-sidebar-border flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {user.displayName?.[0] || user.username[0]}
            </span>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user.displayName || user.username}
            </p>
            <p className="text-xs text-sidebar-foreground/70 truncate capitalize">
              {user.membershipTier} Member
            </p>
          </div>
        </div>
      )}

      {user && collapsed && (
        <div className="p-2 border-t border-sidebar-border flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {user.displayName?.[0] || user.username[0]}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
