
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PlantDiagnosis from "./pages/PlantDiagnosis";
import AnalisePlantas from "./pages/AnalisePlantas";
import Weather from "./pages/Weather";
import Fields from "./pages/Fields";
import Activities from "./pages/Activities";
import BestPractices from "./pages/BestPractices";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Página inicial pública - agora também acessível pelo caminho raiz */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Rota de autenticação */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Rotas protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="diagnostico" element={<AnalisePlantas />} />
              <Route path="plant-diagnosis" element={<PlantDiagnosis />} />
              <Route path="analise-plantas" element={<AnalisePlantas />} />
              <Route path="analise" element={<AnalisePlantas />} />
              <Route path="clima" element={<Weather />} />
              <Route path="lavouras" element={<Fields />} />
              <Route path="atividades" element={<Activities />} />
              <Route path="boas-praticas" element={<BestPractices />} />
              <Route path="notificacoes" element={<Notifications />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Default redirection - removemos pois agora a rota raiz exibe a Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
