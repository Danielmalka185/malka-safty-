import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { DataProvider } from "@/context/DataContext";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import Employees from "./pages/Employees";
import TrainingTypes from "./pages/TrainingTypes";
import Trainings from "./pages/Trainings";
import Certificates from "./pages/Certificates";
import RiskSurveys from "./pages/RiskSurveys";
import Billings from "./pages/Billings";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DataProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/training-types" element={<TrainingTypes />} />
              <Route path="/trainings" element={<Trainings />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/risk-surveys" element={<RiskSurveys />} />
              <Route path="/billings" element={<Billings />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
