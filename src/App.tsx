
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";

import AIModelsRedesigned from "./pages/admin/AIModelsRedesigned";
import AddAIModel from "./pages/admin/AddAIModel";
import AIModelTester from "./pages/admin/AIModelTester";
import AIProviderConfigsPage from "./pages/admin/AIProviderConfigs";
import AIConfiguration from "./pages/admin/AIConfiguration";
import ContextRulesPage from "./pages/admin/ContextRules";
import WidgetConfigPage from "./pages/admin/WidgetConfig";
import APITester from "./pages/admin/APITester";

// Lazy loaded pages
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/ai-models" element={<AIModelsRedesigned />} />
          <Route path="/admin/ai-models/add" element={<AddAIModel />} />
          <Route path="/admin/ai-models/test/:id" element={<AIModelTester />} />
          <Route path="/admin/ai-providers" element={<AIProviderConfigsPage />} />
          <Route path="/admin/ai-configuration" element={<AIConfiguration />} />
          <Route path="/admin/context-rules" element={<ContextRulesPage />} />
          <Route path="/admin/widget-config" element={<WidgetConfigPage />} />
          <Route path="/admin/api-tester" element={<APITester />} />

          {/* Default Route - Redirect to Login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 Route */}
          <Route path="*" element={
            <Suspense fallback={<div>Loading...</div>}>
              <NotFound />
            </Suspense>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
