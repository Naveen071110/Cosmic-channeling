import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Meditate from "@/pages/Meditate";
import Explore from "@/pages/Explore";
import Journal from "@/pages/Journal";
import Tools from "@/pages/Tools";
import Pricing from "@/pages/Pricing";
import Subscribe from "@/pages/Subscribe";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Auth from "./pages/Auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/ui/StarBackground";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/ProtectedRoute";

import { useAuth } from "./hooks/use-auth";

function AppRouter() {
  const { user } = useAuth();
  
  return (
    <>
      {user && <Header />}
      <Switch>
        <Route path="/auth" component={Auth} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <ProtectedRoute path="/" component={Home} />
        <ProtectedRoute path="/meditate" component={Meditate} />
        <ProtectedRoute path="/explore" component={Explore} />
        <ProtectedRoute path="/journal" component={Journal} />
        <ProtectedRoute path="/tools" component={Tools} />
        <ProtectedRoute path="/pricing" component={Pricing} />
        <ProtectedRoute path="/subscribe" component={Subscribe} />
        <Route component={NotFound} />
      </Switch>
      {user && <Footer />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col text-[#F8FAFC] bg-[#0F172A]">
            <StarBackground />
            <Toaster />
            <Router>
              <AppRouter />
            </Router>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
