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
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function AppRouter() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/meditate" component={Meditate} />
        <Route path="/explore" component={Explore} />
        <Route path="/journal" component={Journal} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="star-bg min-h-screen flex flex-col text-[#F8FAFC]">
          <Toaster />
          <Router>
            <AppRouter />
          </Router>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
