import { useState } from "react";
import { Link } from "wouter";
import { User } from "@/lib/types";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES, MEMBERSHIP_TIERS } from "@/lib/constants";
import { getInitials, getMembershipColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, User as UserIcon, CreditCard, Settings } from "lucide-react";

interface UserMenuProps {
  user: User;
}

export default function UserMenu({ user }: UserMenuProps) {
  const { logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={user.avatar || ""} alt={user.username} />
            <AvatarFallback className="bg-primary text-white">
              {getInitials(user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.username)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <Badge variant="outline" className={`mt-1 ${getMembershipColor(user.membershipTier)}`}>
              {user.membershipTier.charAt(0).toUpperCase() + user.membershipTier.slice(1)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={ROUTES.PROFILE(user.username)}>
          <DropdownMenuItem className="cursor-pointer">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        <Link href={ROUTES.MEMBERSHIP}>
          <DropdownMenuItem className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Membership</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        {user.membershipTier === MEMBERSHIP_TIERS.ADMIN && (
          <>
            <DropdownMenuSeparator />
            <Link href={ROUTES.ADMIN}>
              <DropdownMenuItem className="cursor-pointer">
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600" 
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
