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
      totalValue: 0,
      efficiency: 0,
      qualityScore: 0,
      onTimeDelivery: 0
    },
    alerts: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
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
          { id: 1, orderId: 'MO-001', product: 'Product 1', quantity: 100, startDate: '2024-01-15', endDate: '2024-01-20', status: 'In Progress', priority: 'High' },
          { id: 2, orderId: 'MO-002', product: 'Product 2', quantity: 50, startDate: '2024-01-16', endDate: '2024-01-22', status: 'Pending', priority: 'Medium' },
          { id: 3, orderId: 'MO-003', product: 'Product 3', quantity: 75, startDate: '2024-01-10', endDate: '2024-01-18', status: 'Completed', priority: 'Low' },
          { id: 4, orderId: 'MO-004', product: 'Product 4', quantity: 200, startDate: '2024-01-18', endDate: '2024-01-25', status: 'In Progress', priority: 'High' }
        ],
        workOrders: [
          { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', product: 'Product 1', quantity: 3, expectedDuration: 180, realDuration: 165, status: 'In Time', efficiency: 92 },
          { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', product: 'Product 2', quantity: 2, expectedDuration: 120, realDuration: 135, status: 'Delayed', efficiency: 89 },
          { id: 3, operation: 'Work Order 3', workCenter: 'Work Center 3', product: 'Product 3', quantity: 5, expectedDuration: 240, realDuration: 220, status: 'In Time', efficiency: 95 }
        ],
        summary: {
          totalOrders: 4,
          activeOrders: 2,
          completedOrders: 1,
          totalValue: 25000,
          efficiency: 92,
          qualityScore: 94,
          onTimeDelivery: 87
        },
        alerts: [
          { id: 1, type: 'warning', message: 'Low stock alert: Raw Material A', timestamp: '2024-01-20T10:30:00Z' },
          { id: 2, type: 'info', message: 'Work Order 2 is running behind schedule', timestamp: '2024-01-20T09:15:00Z' },
          { id: 3, type: 'success', message: 'Manufacturing Order MO-003 completed successfully', timestamp: '2024-01-20T08:45:00Z' }
        ],
        recentActivity: [
          { id: 1, action: 'Order Created', description: 'MO-004 created by John Doe', timestamp: '2024-01-20T11:00:00Z', user: 'John Doe' },
          { id: 2, action: 'Status Updated', description: 'MO-001 status changed to In Progress', timestamp: '2024-01-20T10:45:00Z', user: 'Jane Smith' },
          { id: 3, action: 'Work Order Completed', description: 'Work Order 1 completed ahead of schedule', timestamp: '2024-01-20T10:30:00Z', user: 'Mike Johnson' }
        ]
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Dashboard</h1>
          <p className="text-secondary-600 mt-1">Welcome back! Here's what's happening in your manufacturing operations.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary-600">Time Range:</span>
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-secondary-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onNavigate={handleVoiceNavigate}
            onAction={handleVoiceAction}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Orders"
          value={dashboardData.summary.totalOrders}
          icon="📊"
          color="blue"
          trend="up"
          trendValue="+12%"
          onClick={() => navigate('/app/manufacturing-orders')}
        />
        <DashboardCard
          title="Active Orders"
          value={dashboardData.summary.activeOrders}
          icon="⚡"
          color="green"
          trend="up"
          trendValue="+8%"
          onClick={() => navigate('/app/manufacturing-orders?status=active')}
        />
        <DashboardCard
          title="Completed Orders"
          value={dashboardData.summary.completedOrders}
          icon="✅"
          color="purple"
          trend="up"
          trendValue="+15%"
          onClick={() => navigate('/app/manufacturing-orders?status=completed')}
        />
        <DashboardCard
          title="Total Value"
          value={`$${dashboardData.summary.totalValue.toLocaleString()}`}
          icon="💰"
          color="yellow"
          trend="up"
          trendValue="+22%"
          onClick={() => navigate('/app/reports')}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Efficiency"
          value={`${dashboardData.summary.efficiency}%`}
          icon="⚙️"
          color="blue"
          trend="up"
          trendValue="+3%"
          onClick={() => navigate('/app/reports?metric=efficiency')}
        />
        <DashboardCard
          title="Quality Score"
          value={`${dashboardData.summary.qualityScore}%`}
          icon="⭐"
          color="green"
          trend="up"
          trendValue="+2%"
          onClick={() => navigate('/app/reports?metric=quality')}
        />
        <DashboardCard
          title="On-Time Delivery"
          value={`${dashboardData.summary.onTimeDelivery}%`}
          icon="🚚"
          color="purple"
          trend="down"
          trendValue="-1%"
          onClick={() => navigate('/app/reports?metric=delivery')}
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/app/manufacturing-orders?action=create')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-primary-200 bg-primary-50 hover:bg-primary-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-primary-900">New Order</p>
              <p className="text-sm text-primary-600">Create manufacturing order</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/app/work-orders?action=create')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-success-200 bg-success-50 hover:bg-success-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-success-900">Work Order</p>
              <p className="text-sm text-success-600">Create work order</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/app/reports')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-warning-200 bg-warning-50 hover:bg-warning-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-warning-900">Reports</p>
              <p className="text-sm text-warning-600">View analytics</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/app/stock-ledger')}
            className="flex items-center space-x-3 p-4 rounded-lg border border-secondary-200 bg-secondary-50 hover:bg-secondary-100 transition-colors duration-200 group"
          >
            <div className="w-10 h-10 bg-secondary-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-secondary-900">Stock</p>
              <p className="text-sm text-secondary-600">Check inventory</p>
            </div>
          </button>
        </div>
      </div>

      {/* Manufacturing Orders Overview */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Recent Manufacturing Orders</h2>
            <p className="text-secondary-600 text-sm">Latest orders and their current status</p>
          </div>
          <button
            onClick={() => navigate('/app/manufacturing-orders')}
            className="btn-outline btn-sm"
          >
            View All Orders
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <OrderTable
          data={dashboardData.manufacturingOrders || []}
          columns={manufacturingOrderColumns}
          onRowClick={(row) => navigate(`/app/manufacturing-orders/${row.id}`)}
          showActions={false}
          emptyMessage="No manufacturing orders found"
        />
      </div>

      {/* Work Orders Breakdown */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Work Orders Breakdown</h2>
            <p className="text-secondary-600 text-sm">Current work orders and their progress</p>
          </div>
          <button
            onClick={() => navigate('/app/work-orders')}
            className="btn-outline btn-sm"
          >
            View All Work Orders
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <OrderTable
          data={dashboardData.workOrders || []}
          columns={breakdownColumns}
          onRowClick={(row) => navigate(`/app/work-orders/${row.id}`)}
          showActions={false}
          emptyMessage="No work orders found"
        />
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Alerts</h2>
            <span className="text-sm text-secondary-500">{dashboardData.alerts?.length || 0} alerts</span>
          </div>
          <div className="space-y-3">
            {(dashboardData.alerts || []).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                alert.type === 'warning' ? 'border-warning-500 bg-warning-50' :
                alert.type === 'error' ? 'border-danger-500 bg-danger-50' :
                alert.type === 'success' ? 'border-success-500 bg-success-50' :
                'border-info-500 bg-info-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{alert.message}</p>
                    <p className="text-xs text-secondary-500 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-warning-500' :
                    alert.type === 'error' ? 'bg-danger-500' :
                    alert.type === 'success' ? 'bg-success-500' :
                    'bg-info-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900">Recent Activity</h2>
            <button
              onClick={() => navigate('/app/reports?tab=activity')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {(dashboardData.recentActivity || []).map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-secondary-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-900">{activity.action}</p>
                  <p className="text-sm text-secondary-600">{activity.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-secondary-500">{activity.user}</p>
                    <p className="text-xs text-secondary-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Production Chart Placeholder */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">Production Trends</h2>
            <p className="text-secondary-600 text-sm">Manufacturing output over time</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-full">Orders</button>
            <button className="px-3 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full">Efficiency</button>
            <button className="px-3 py-1 text-xs bg-secondary-100 text-secondary-700 rounded-full">Quality</button>
          </div>
        </div>
        <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <svg className="w-16 h-16 text-primary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-primary-600 font-medium">Production Chart</p>
            <p className="text-primary-500 text-sm">Interactive charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
