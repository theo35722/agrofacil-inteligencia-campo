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
import Marketplace from "./pages/Marketplace";
import MyListings from "./pages/MyListings";
import CreateMarketplaceProduct from "./pages/CreateMarketplaceProduct";
import EditMarketplaceProduct from "./pages/EditMarketplaceProduct";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import WeatherTest from "./pages/WeatherTest";

// Configure React Query with better cache management
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 2,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Página inicial pública - apenas para usuários não autenticados */}
            <Route path="/" element={<Home />} />
            
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
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="my-listings" element={<MyListings />} />
              <Route path="perfil" element={<Profile />} />
              <Route path="create-marketplace-product" element={<CreateMarketplaceProduct />} />
              <Route path="edit-marketplace-product/:productId" element={<EditMarketplaceProduct />} />
              <Route path="weather-test" element={<WeatherTest />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* Redireção padrão */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
