import React, { useState, useEffect } from 'react';
import DashboardCard from '../components/DashboardCard';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { manufacturingAPI } from '../services/manufacturingAPI';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    manufacturingOrders: [],
    workOrders: [],
    stockItems: [],
    summary: {
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalValue: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await manufacturingAPI.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      // Mock data for demo
      setDashboardData({
        manufacturingOrders: [
          { id: 1, orderId: 'MO-001', product: 'Product 1', quantity: 100, startDate: '2024-01-15', endDate: '2024-01-20', status: 'In Progress' },
          { id: 2, orderId: 'MO-002', product: 'Product 2', quantity: 50, startDate: '2024-01-16', endDate: '2024-01-22', status: 'Pending' },
          { id: 3, orderId: 'MO-003', product: 'Product 3', quantity: 75, startDate: '2024-01-10', endDate: '2024-01-18', status: 'Completed' }
        ],
        workOrders: [
          { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', product: 'Product 1', quantity: 3, expectedDuration: 180, realDuration: 0, status: 'In Time' },
          { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', product: 'Product 2', quantity: 2, expectedDuration: 120, realDuration: 0, status: 'In Time' }
        ],
        summary: {
          totalOrders: 3,
          activeOrders: 2,
          completedOrders: 1,
          totalValue: 15000
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      // Handle search functionality
      console.log('Search for:', data);
    }
  };

  const handleVoiceAction = (action) => {
    switch (action) {
      case 'createManufacturingOrder':
        navigate('/manufacturing-orders?action=create');
        break;
      case 'createWorkOrder':
        navigate('/work-orders?action=create');
        break;
      default:
        console.log('Action:', action);
    }
  };

  const handleVoiceNavigate = (path) => {
    navigate(path);
  };

  const manufacturingOrderColumns = [
    { key: 'orderId', header: 'Order ID' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'status', header: 'Status' }
  ];

  const breakdownColumns = [
    { key: 'operation', header: 'Operation' },
    { key: 'workCenter', header: 'Work Center' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'expectedDuration', header: 'Expected Duration' },
    { key: 'realDuration', header: 'Real Duration' },
    { key: 'status', header: 'Status' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <VoiceCommand
          onCommand={handleVoiceCommand}
          onNavigate={handleVoiceNavigate}
          onAction={handleVoiceAction}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Orders"
          value={dashboardData.summary.totalOrders}
          icon="📊"
          color="blue"
          onClick={() => navigate('/manufacturing-orders')}
        />
        <DashboardCard
          title="Active Orders"
          value={dashboardData.summary.activeOrders}
          icon="⚡"
          color="green"
          onClick={() => navigate('/manufacturing-orders?status=active')}
        />
        <DashboardCard
          title="Completed Orders"
          value={dashboardData.summary.completedOrders}
          icon="✅"
          color="purple"
          onClick={() => navigate('/manufacturing-orders?status=completed')}
        />
        <DashboardCard
          title="Total Value"
          value={`$${dashboardData.summary.totalValue.toLocaleString()}`}
          icon="💰"
          color="yellow"
          onClick={() => navigate('/reports')}
        />
      </div>

      {/* Manufacturing Orders Overview */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Manufacturing Orders</h2>
          <button
            onClick={() => navigate('/manufacturing-orders')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <OrderTable
          data={dashboardData.manufacturingOrders}
          columns={manufacturingOrderColumns}
          onRowClick={(row) => navigate(`/manufacturing-orders/${row.id}`)}
          showActions={false}
        />
      </div>

      {/* Breakdown Section */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Breakdown</h2>
        <OrderTable
          data={dashboardData.workOrders}
          columns={breakdownColumns}
          onRowClick={(row) => navigate(`/work-orders/${row.id}`)}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default Dashboard;
