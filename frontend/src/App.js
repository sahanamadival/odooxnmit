import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
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
