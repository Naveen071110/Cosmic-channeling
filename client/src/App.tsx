import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { lazy, Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StarBackground from "@/components/ui/StarBackground";
import { AuthProvider } from "./hooks/use-auth";

// Lazy load pages to reduce initial bundle size
const Home = lazy(() => import("./pages/Home"));
const Meditate = lazy(() => import("./pages/Meditate"));
const Explore = lazy(() => import("./pages/Explore"));
const Journal = lazy(() => import("./pages/Journal"));
const Tools = lazy(() => import("./pages/Tools"));
const Blog = lazy(() => import("./pages/Blog"));
const Religions = lazy(() => import("./pages/Religions"));
const Subscribe = lazy(() => import("./pages/Subscribe"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Auth = lazy(() => import("./pages/Auth"));


function AppRouter() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/" component={Home} />
            <Route path="/meditate" component={Meditate} />
            <Route path="/explore" component={Explore} />
            <Route path="/journal" component={Journal} />
            <Route path="/tools" component={Tools} />
            <Route path="/blog" component={Blog} />
            <Route path="/religions" component={Religions} />
            <Route path="/subscribe" component={Subscribe} />
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen text-[#F8FAFC] bg-[#0F172A] flex flex-col">
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