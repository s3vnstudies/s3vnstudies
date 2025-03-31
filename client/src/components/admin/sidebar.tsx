import { NavLink } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Users,
  Settings,
  Tag,
  MessageSquare,
  Home,
  Bell,
  PlusCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminSidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: AdminSidebarProps) {
  const adminLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Articles", icon: FileText },
    { href: "/admin/products", label: "Products", icon: ShoppingBag },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/chat-rooms", label: "Chat Rooms", icon: MessageSquare },
    { href: "/admin/bulletin", label: "Bulletin Board", icon: Bell },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const NavItem = ({ href, label, icon: Icon }: typeof adminLinks[0]) => {
    return (
      <NavLink href={href}>
        {({ isActive }) => (
          <a
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
            )}
          >
            <Icon className="h-5 w-5 mr-2" />
            {label}
          </a>
        )}
      </NavLink>
    );
  };

  return (
    <div className={cn("w-64 border-r border-border h-screen", className)}>
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">S7</span>
          </div>
          <span className="ml-2 font-semibold text-lg">Admin Dashboard</span>
        </div>

        <ScrollArea className="h-[calc(100vh-130px)]">
          <div className="space-y-1">
            {adminLinks.slice(0, 1).map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Content Management
            </h3>
            {adminLinks.slice(1, 4).map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
            <div className="pl-10 mt-1">
              <div className="flex items-center text-sm text-neutral-500 hover:text-primary cursor-pointer">
                <PlusCircle className="h-4 w-4 mr-1" />
                <span>Create Article</span>
              </div>
              <div className="flex items-center text-sm text-neutral-500 hover:text-primary cursor-pointer mt-1">
                <PlusCircle className="h-4 w-4 mr-1" />
                <span>Add Product</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Community
            </h3>
            {adminLinks.slice(4, 6).map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>

          <div className="mt-6 space-y-1">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Configuration
            </h3>
            {adminLinks.slice(6, 8).map((link) => (
              <NavItem key={link.href} {...link} />
            ))}
          </div>

          <Separator className="my-6" />

          <NavLink href="/">
            {({ isActive }) => (
              <a
                className={cn(
                  "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-neutral-700 hover:bg-neutral-100 hover:text-primary"
                )}
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Website
              </a>
            )}
          </NavLink>
        </ScrollArea>
      </div>
    </div>
  );
}
