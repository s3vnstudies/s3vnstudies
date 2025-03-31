import { Link } from "wouter";
import { User } from "@/lib/types";
import { ROUTES } from "@/lib/constants";
import { getMembershipColor, getInitials, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MemberCardProps {
  member: User;
  badge?: string;
}

export default function MemberCard({ member, badge }: MemberCardProps) {
  const displayName = member.firstName && member.lastName 
    ? `${member.firstName} ${member.lastName}` 
    : member.username;
    
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center">
          <Link href={ROUTES.PROFILE(member.username)}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} alt={member.username} />
              <AvatarFallback className="bg-primary text-white">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <div className="ml-3">
            <Link href={ROUTES.PROFILE(member.username)}>
              <p className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
                {displayName}
              </p>
            </Link>
            <div className="flex space-x-2 mt-1">
              <Badge 
                variant="outline" 
                className={getMembershipColor(member.membershipTier)}
              >
                {member.membershipTier.charAt(0).toUpperCase() + member.membershipTier.slice(1)}
              </Badge>
              
              {badge && (
                <Badge 
                  variant="outline" 
                  className="bg-amber-100 text-amber-800"
                >
                  {badge}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Member since: {formatDate(member.createdAt)}</p>
        </div>
        
        <div className="flex justify-between mt-4">
          <Link href={ROUTES.PROFILE(member.username)}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
          
          <Button variant="ghost" size="sm">
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
