import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth/index";
import StudentDashboard from "@/pages/student/dashboard";

// Admin Pages
import AdminStudents from "@/pages/admin/students";
import AdminRent from "@/pages/admin/rent";
import AdminMenu from "@/pages/admin/menu";
import AdminNotifications from "@/pages/admin/notifications";
import AdminSettings from "@/pages/admin/settings";

function Router() {
  return (
    <Switch>
      {/* Public Route */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Redirect root to auth */}
      <Route path="/">
        <Redirect to="/auth" />
      </Route>

      {/* Student Routes */}
      <ProtectedRoute path="/student" component={StudentDashboard} role="student" />

      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminStudents} role="admin" />
      <ProtectedRoute path="/admin/students" component={AdminStudents} role="admin" />
      <ProtectedRoute path="/admin/rent" component={AdminRent} role="admin" />
      <ProtectedRoute path="/admin/menu" component={AdminMenu} role="admin" />
      <ProtectedRoute path="/admin/notifications" component={AdminNotifications} role="admin" />
      <ProtectedRoute path="/admin/settings" component={AdminSettings} role="admin" />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
