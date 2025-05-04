
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container py-4 md:py-6 px-3 md:px-6 mb-16">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-center" closeButton richColors />
    </div>
  );
};
