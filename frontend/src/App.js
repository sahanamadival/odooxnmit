import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ManufacturingProvider } from './context/ManufacturingContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BackToDashboard from './components/BackToDashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ManufacturingOrdersInterface from './pages/ManufacturingOrdersInterface';
import WorkOrders from './pages/WorkOrders';
import BillsOfMaterials from './pages/BillsOfMaterials';
import WorkCenter from './pages/WorkCenter';

import StockLedger from './pages/StockLedger';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import './styles/tailwind.css';
import './styles/main.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

const AppLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <Header onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className="flex-1 p-4 lg:p-6 transition-all duration-300">
          <div className="animate-fade-in">
            <BackToDashboard />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page redirects to signup */}
      <Route path="/" element={<Navigate to="/signup" />} />
      
      {/* SignUp page */}
      <Route path="/signup" element={
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      } />
      
      {/* Login page */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* Dashboard route */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Manufacturing routes */}
      <Route path="/manufacturing-orders" element={
        <ProtectedRoute>
          <ManufacturingOrdersInterface />
        </ProtectedRoute>
      } />
      <Route path="/manufacturing-orders/:id" element={
        <ProtectedRoute>
          <ManufacturingOrdersInterface />
        </ProtectedRoute>
      } />
      
      {/* Other protected routes */}
      <Route path="/bills-of-materials" element={
        <ProtectedRoute>
          <AppLayout>
            <BillsOfMaterials />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/work-orders" element={
        <ProtectedRoute>
          <AppLayout>
            <WorkOrders />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/work-center" element={
        <ProtectedRoute>
          <AppLayout>
            <WorkCenter />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/stock-ledger" element={
        <ProtectedRoute>
          <AppLayout>
            <StockLedger />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/stock-ledger/:mode" element={
        <ProtectedRoute>
          <AppLayout>
            <StockLedger />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <AppLayout>
            <Reports />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      } />
      
      {/* Legacy redirects */}
      <Route path="/app/*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ManufacturingProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ManufacturingProvider>
    </AuthProvider>
  );
}

export default App;
