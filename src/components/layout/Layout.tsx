
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className={`flex-1 container ${isMobile ? 'py-4 px-0' : 'py-6 px-4 md:px-6'} ${isMobile ? 'mb-20' : 'mb-16'}`}>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};
