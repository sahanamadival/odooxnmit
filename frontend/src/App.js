import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ManufacturingOrders from './pages/ManufacturingOrders';
import WorkOrders from './pages/WorkOrders';
import BillsOfMaterials from './pages/BillsOfMaterials';
import WorkCenter from './pages/WorkCenter';
import StockLedger from './pages/StockLedger';
import Reports from './pages/Reports';
import './styles/tailwind.css';

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
      <Navbar onMenuToggle={toggleMobileMenu} isMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        <Sidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
        <main className="flex-1 p-4 lg:p-6 transition-all duration-300">
          <div className="animate-fade-in">
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
      {/* Landing page - shows first */}
      <Route path="/" element={<Landing />} />
      
      {/* Login/Signup page */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes - only accessible when logged in */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/app/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/manufacturing-orders" element={<ManufacturingOrders />} />
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route path="/bills-of-materials" element={<BillsOfMaterials />} />
                <Route path="/work-center" element={<WorkCenter />} />
                <Route path="/stock-ledger" element={<StockLedger />} />
                <Route path="/reports" element={<Reports />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect old dashboard route to new app route */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" />} />
      <Route path="/manufacturing-orders" element={<Navigate to="/app/manufacturing-orders" />} />
      <Route path="/work-orders" element={<Navigate to="/app/work-orders" />} />
      <Route path="/bills-of-materials" element={<Navigate to="/app/bills-of-materials" />} />
      <Route path="/work-center" element={<Navigate to="/app/work-center" />} />
      <Route path="/stock-ledger" element={<Navigate to="/app/stock-ledger" />} />
      <Route path="/reports" element={<Navigate to="/app/reports" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
