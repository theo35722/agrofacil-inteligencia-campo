
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PlantDiagnosis from "./pages/PlantDiagnosis";
import Weather from "./pages/Weather";
import Fields from "./pages/Fields";
import Activities from "./pages/Activities";
import BestPractices from "./pages/BestPractices";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="diagnostico" element={<PlantDiagnosis />} />
            <Route path="clima" element={<Weather />} />
            <Route path="lavouras" element={<Fields />} />
            <Route path="atividades" element={<Activities />} />
            <Route path="boas-praticas" element={<BestPractices />} />
            <Route path="notificacoes" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
