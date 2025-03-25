import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./context/cart-context";
import { ChatProvider } from "./context/chat-context";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ArticlesPage from "@/pages/articles-page";
import VideosPage from "@/pages/videos-page";
import CommunityPage from "@/pages/community-page";
import StorePage from "@/pages/store-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile-page";
import MembershipPage from "@/pages/membership-page";
import FunGamesPage from "@/pages/fun-games-page";
import PoliciesPage from "@/pages/policies-page";
import AdminPage from "@/pages/admin-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/videos" component={VideosPage} />
      <ProtectedRoute path="/community" component={CommunityPage} />
      <Route path="/store" component={StorePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/membership" component={MembershipPage} />
      <Route path="/fun-games" component={FunGamesPage} />
      <Route path="/policies" component={PoliciesPage} />
      <ProtectedRoute path="/admin" component={AdminPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ChatProvider>
            <Router />
            <Toaster />
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
