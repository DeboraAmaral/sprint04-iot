import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import FacialLoginScreen from "../src/screens/FacialLoginScreen";
import FacialRegisterLiveScreen from "../src/screens/FacialRegisterLiveScreen";
import FacialLoginLiveScreen from "../src/screens/FacialLoginLiveScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Rotas de Reconhecimento Facial */}
            <Route path="/facial-login" element={<FacialLoginScreen />} />
            <Route path="/facial-register-live" element={<FacialRegisterLiveScreen />} />
            <Route path="/facial-login-live" element={<FacialLoginLiveScreen />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;