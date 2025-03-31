import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ArticlesPage from "@/pages/articles-page";
import ArticleDetailPage from "@/pages/article-detail-page";
import VideosPage from "@/pages/videos-page";
import StorePage from "@/pages/store-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import CommunityPage from "@/pages/community-page";
import ChatPage from "@/pages/chat-page";
import ProfilePage from "@/pages/profile-page";
import AuthPage from "@/pages/auth-page";
import SelfHelpStudiesPage from "@/pages/self-help-studies-page";
import FunGamesPage from "@/pages/fun-games-page";
import PoliciesPage from "@/pages/policies-page";
import MembershipPage from "@/pages/membership-page";
import AdminPage from "@/pages/admin-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/articles/:id" component={ArticleDetailPage} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/store" component={StorePage} />
      <Route path="/store/:id" component={ProductDetailPage} />
      <Route path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={() => <CheckoutPage />} />
      <Route path="/community" component={CommunityPage} />
      <ProtectedRoute path="/chat" component={() => <ChatPage />} />
      <ProtectedRoute path="/profile" component={() => <ProfilePage />} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/self-help-studies" component={SelfHelpStudiesPage} />
      <Route path="/fun-games" component={FunGamesPage} />
      <Route path="/policies" component={PoliciesPage} />
      <Route path="/membership" component={MembershipPage} />
      <ProtectedRoute path="/admin" component={() => <AdminPage />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
