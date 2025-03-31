import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import HomePage from "@/pages/home-page";
import AboutPage from "@/pages/about-page";
import ArticlesPage from "@/pages/articles-page";
import AuthPage from "@/pages/auth-page";
import StorePage from "@/pages/store-page";
import ProductPage from "@/pages/product-page";
import CheckoutPage from "@/pages/checkout-page";
import ProfilePage from "@/pages/profile-page";
import CommunityPage from "@/pages/community-page";
import ChatPage from "@/pages/chat-page";
import VideosPage from "@/pages/videos-page";
import GamesPage from "@/pages/games-page";
import PoliciesPage from "@/pages/policies-page";
import AdminPage from "@/pages/admin-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/lib/protected-route";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/store" component={StorePage} />
      <Route path="/store/product/:id" component={ProductPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <Route path="/community" component={CommunityPage} />
      <ProtectedRoute path="/chat" component={ChatPage} />
      <Route path="/videos" component={VideosPage} />
      <Route path="/games" component={GamesPage} />
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
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
