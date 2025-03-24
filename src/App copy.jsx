// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import Panels from './pages/Panels';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeProvider';
import { BaseApiService } from './services/api';
import Countries from './pages/Countries';
import Cities from './pages/City';
import Communes from './pages/Communes';
import GroupPannel from './pages/GroupPannel';
import TypePannel from './pages/TypePannel';
import Customer from './pages/Customer';
import Campagn from './pages/Campagn';
import Alert from './pages/Alert';
import Users from './pages/Users';

// Page de chargement
const LoadingPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Chargement...</p>
    </div>
  </div>
);

// Composant de protection de route
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = BaseApiService.getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion avec l'emplacement actuel pour revenir après l'authentification
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Composant d'authentification pour la page de login
const AuthRedirect = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = BaseApiService.getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Composant d'autorisation admin
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = () => {
      const isUserAdmin = BaseApiService.isAdmin();
      setIsAdmin(isUserAdmin);
      setIsLoading(false);
    };

    checkAdmin();
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAdmin) {
    // Rediriger vers le dashboard avec un message d'accès refusé
    return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <Routes>
          {/* Route de redirection */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Route de connexion */}
          <Route
            path="/login"
            element={
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            }
          />

          {/* Routes du dashboard - Toutes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="panels" element={<Panels />} />

            {/* Routes nécessitant des privilèges d'administrateur */}
            {/* <Route 
              path="users" 
              element={
                <AdminRoute>
                  <UnderDevelopment pageName="Utilisateurs" />
                </AdminRoute>
              } 
            /> */}

           <Route path="pays" element={<Countries pageName="Pays" />} />
            <Route path="communes" element={<Communes pageName="Communes" />} />
            <Route path="cities" element={<Cities pageName="Villes" />} />
            <Route path="panel-groups" element={<GroupPannel pageName="Groupe Panneaux" />} />
            <Route path="panel-types" element={<TypePannel pageName="Type Panneaux" />} />
            <Route path="clients" element={<Customer pageName="Clients" />} />
            <Route path="campaigns" element={<Campagn pageName="Campagnes" />} />
            <Route path="settings" element={<Alert pageName="Paramètres" />} />
            <Route path="users" element={<Users pageName="Utilisateurs" />} />

              {/*<Route path="panel-groups" element={<UnderDevelopment pageName="Groupe Panneaux" />} />
            <Route path="panel-types" element={<UnderDevelopment pageName="Type Panneaux" />} />
            <Route path="clients" element={<UnderDevelopment pageName="Clients" />} />
            <Route path="campaigns" element={<UnderDevelopment pageName="Campagnes" />} />
            <Route path="settings" element={<UnderDevelopment pageName="Paramètres" />} /> */}
          </Route>

          {/* Route par défaut */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;