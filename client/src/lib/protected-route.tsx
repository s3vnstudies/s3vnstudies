import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
  requiredMembership,
  adminOnly = false,
}: {
  path: string;
  component: () => React.JSX.Element;
  requiredMembership?: "free" | "pro";
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        {() => (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        {() => <Redirect to="/auth" />}
      </Route>
    );
  }
  
  // Check for admin access
  if (adminOnly && !user.isAdmin) {
    return (
      <Route path={path}>
        {() => <Redirect to="/" />}
      </Route>
    );
  }

  if (requiredMembership && requiredMembership !== "free") {
    const tierLevels: Record<string, number> = {
      "free": 0,
      "pro": 1
    };
    
    const requiredLevel = tierLevels[requiredMembership];
    const userLevel = tierLevels[user.membershipTier];
    
    if (userLevel < requiredLevel) {
      return (
        <Route path={path}>
          {() => <Redirect to="/membership" />}
        </Route>
      );
    }
  }

  return <Route path={path} component={Component} />;
}
