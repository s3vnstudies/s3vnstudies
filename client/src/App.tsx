import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "@/layouts/MainLayout";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ArticlesPage from "@/pages/articles-page";
import ArticleDetailPage from "@/pages/article-detail-page";
import CategoryPage from "@/pages/category-page";
import VideosPage from "@/pages/videos-page";
import FavoriteVideosPage from "@/pages/favorite-videos-page";
import WatchLaterPage from "@/pages/watch-later-page";
import StorePage from "@/pages/store-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import CommunityPage from "@/pages/community-page";
import ChatPage from "@/pages/chat-page";
import ProfilePage from "@/pages/profile-page";
import AuthPage from "@/pages/auth-page";
import SelfHelpStudiesPage from "@/pages/self-help-studies-page";
import FunAndGamesPage from "@/pages/fun-and-games";
import BackyardActivitiesPage from "@/pages/fun-and-games/backyard";
import BackyardArticlePage from "@/pages/fun-and-games/backyard/[slug]";
import PoliciesPage from "@/pages/policies-page";
import MembershipPage from "@/pages/membership-page";
import AiAssistantPage from "@/pages/ai-assistant-page";
import AdminPage from "@/pages/admin-page";
import AdminDashboard from "@/pages/admin-dashboard";
import SubscribePage from "@/pages/subscribe-page";
import SubscriptionSuccess from "@/pages/subscribe-success";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import ConsentModal from "@/components/ads/ConsentModal";
import { useAdConsent } from "@/hooks/use-ad-consent";

// Routes that should not use the main layout
const noLayoutRoutes = ['/auth'];

function AppRoutes() {
  const [location] = useLocation();
  
  // Check if the current route should use the main layout
  const useMainLayout = !noLayoutRoutes.some(route => location.startsWith(route));
  
  const routes = (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/articles/category/:category" component={CategoryPage} />
      <Route path="/articles/:id" component={ArticleDetailPage} />
      <Route path="/videos" component={VideosPage} />
      <ProtectedRoute path="/favorites" component={() => <FavoriteVideosPage />} />
      <ProtectedRoute path="/watch-later" component={() => <WatchLaterPage />} />
      <Route path="/store" component={StorePage} />
      <Route path="/store/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={() => <CheckoutPage />} />
      <Route path="/community" component={CommunityPage} />
      <ProtectedRoute path="/chat" component={() => <ChatPage />} />
      <ProtectedRoute path="/profile" component={() => <ProfilePage />} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/self-help-studies" component={SelfHelpStudiesPage} />
      <Route path="/fun-and-games" component={FunAndGamesPage} />
      <Route 
        path="/fun-and-games/backyard"
        component={BackyardActivitiesPage}
      />
      <ProtectedRoute 
        path="/fun-and-games/backyard/:slug" 
        component={() => <BackyardArticlePage />} 
        requiredMembership="pro" 
      />
      <Route path="/policies" component={PoliciesPage} />
      <Route path="/membership" component={MembershipPage} />
      <Route path="/ai-assistant" component={AiAssistantPage} />
      <ProtectedRoute path="/subscribe" component={() => <SubscribePage />} />
      <ProtectedRoute path="/subscribe-success" component={() => <SubscriptionSuccess />} />
      <ProtectedRoute path="/admin" component={() => <AdminDashboard />} adminOnly={true} />
      <ProtectedRoute path="/admin/dashboard" component={() => <AdminDashboard />} adminOnly={true} />
      <Route component={NotFound} />
    </Switch>
  );
  
  // Conditionally wrap with layout
  return useMainLayout ? <MainLayout>{routes}</MainLayout> : routes;
}

function App() {
  // Use the consent hook to manage ad consent
  const { isConsentModalOpen, grantConsent, denyConsent } = useAdConsent();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster />
          {/* Ad consent modal */}
          <ConsentModal 
            isOpen={isConsentModalOpen}
            onAccept={grantConsent}
            onDecline={denyConsent}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
