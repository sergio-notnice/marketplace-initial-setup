import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { WorkspaceProvider } from './components/ui/workspace-context';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthCallback from './pages/auth/Callback';
import BrandDashboard from './pages/brand/Dashboard';
import CreatorDashboard from './pages/creator/Dashboard';
import NotFound from './pages/NotFound';
import PreviewModeToggle from './components/PreviewModeToggle';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  const { user, previewMode } = useAuthStore();
  const isBrand = user?.role === 'brand' || previewMode === 'brand';
  const isBrandRoute = window.location.pathname.startsWith('/brand');

  return (
    <Router>
      <WorkspaceProvider>
        <PreviewModeToggle />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            {/* Brand Routes */}
            <Route
              path="brand/*"
              element={<BrandDashboard />}
            />

            {/* Creator Routes */}
            <Route
              path="creator/*"
              element={<CreatorDashboard />}
            />

            {/* Redirect root to appropriate dashboard */}
            <Route
              index
              element={<Navigate to={isBrandRoute ? "/brand/campaigns" : "/creator"} replace />}
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </WorkspaceProvider>
    </Router>
  );
}