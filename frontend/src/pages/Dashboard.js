import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useManufacturing } from '../context/ManufacturingContext';
import DashboardCard from '../components/DashboardCard';
import VoiceCommand from '../components/VoiceCommand';

const Dashboard = () => {
  const { manufacturingOrders, workOrders } = useManufacturing();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const navigate = useNavigate();

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (selectedStatus === 'All') return manufacturingOrders;
    return manufacturingOrders.filter(order => {
      switch (selectedStatus) {
        case 'Draft': return order.status === 'Draft';
        case 'Confirmed': return order.status === 'Confirmed';
        case 'In-Progress': return order.status === 'In-Progress';
        case 'Done': return order.status === 'Done';
        case 'Cancelled': return order.status === 'Cancelled';
        default: return true;
      }
    });
  }, [manufacturingOrders, selectedStatus]);

  // Calculate summary data
  const summary = useMemo(() => {
    const total = manufacturingOrders.length;
    const active = manufacturingOrders.filter(o => o.status === 'In-Progress').length;
    const completed = manufacturingOrders.filter(o => o.status === 'Done').length;
    const draft = manufacturingOrders.filter(o => o.status === 'Draft').length;
    const confirmed = manufacturingOrders.filter(o => o.status === 'Confirmed').length;
    
    return {
      totalOrders: total,
      activeOrders: active,
      completedOrders: completed,
      draftOrders: draft,
      confirmedOrders: confirmed
    };
  }, [manufacturingOrders]);

  const statusFilters = ['All', 'Draft', 'Confirmed', 'In-Progress', 'Done', 'Cancelled'];

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
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
        navigate('/manufacturing-orders/new');
        break;
      case 'createWorkOrder':
        navigate('/work-orders');
        break;
      default:
        console.log('Action:', action);
    }
  };

  const handleVoiceNavigate = (path) => {
    navigate(path);
  };

  const manufacturingOrderColumns = [
    { key: 'id', header: 'Order ID' },
    { key: 'finishedProduct', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'scheduleDate', header: 'Schedule Date' },
    { key: 'status', header: 'Status' }
  ];

  const workOrderColumns = [
    { key: 'operation', header: 'Operation' },
    { key: 'workCenter', header: 'Work Center' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'expectedDuration', header: 'Expected Duration' },
    { key: 'realDuration', header: 'Real Duration' },
    { key: 'status', header: 'Status' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manufacturing Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of manufacturing operations and orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/manufacturing-orders/new')}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Order
          </button>
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onNavigate={handleVoiceNavigate}
            onAction={handleVoiceAction}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Orders"
          value={summary.totalOrders}
          icon="📊"
          color="blue"
          onClick={() => handleStatusFilter('All')}
        />
        <DashboardCard
          title="Draft Orders"
          value={summary.draftOrders}
          icon="📝"
          color="gray"
          onClick={() => handleStatusFilter('Draft')}
        />
        <DashboardCard
          title="Confirmed Orders"
          value={summary.confirmedOrders}
          icon="✓"
          color="green"
          onClick={() => handleStatusFilter('Confirmed')}
        />
        <DashboardCard
          title="In Progress"
          value={summary.activeOrders}
          icon="⚡"
          color="yellow"
          onClick={() => handleStatusFilter('In-Progress')}
        />
        <DashboardCard
          title="Completed"
          value={summary.completedOrders}
          icon="✅"
          color="purple"
          onClick={() => handleStatusFilter('Done')}
        />
      </div>

      {/* Status Filter Buttons */}
      <div className="card">
        <div className="flex flex-wrap gap-2 mb-4">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        {/* Filtered Orders Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{filteredOrders.length}</span> of{' '}
            <span className="font-semibold">{manufacturingOrders.length}</span> orders
            {selectedStatus !== 'All' && (
              <span className="text-blue-600"> ({selectedStatus})</span>
            )}
          </p>
        </div>

        {/* Manufacturing Orders Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Manufacturing Orders</h2>
            <button
              onClick={() => navigate('/manufacturing-orders')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {manufacturingOrderColumns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.slice(0, 5).map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/manufacturing-orders/${order.id}`)}
                  >
                    {manufacturingOrderColumns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {column.key === 'status' ? (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Done' ? 'bg-green-100 text-green-800' :
                            order.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        ) : (
                          order[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={manufacturingOrderColumns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                      No manufacturing orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Work Orders Overview */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Work Orders Breakdown</h2>
          <button
            onClick={() => navigate('/work-orders')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {workOrderColumns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workOrders.slice(0, 5).map((workOrder) => (
                <tr 
                  key={workOrder.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/work-orders/${workOrder.id}`)}
                >
                  {workOrderColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.key === 'status' ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          workOrder.status === 'Done' ? 'bg-green-100 text-green-800' :
                          workOrder.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                          workOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          workOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {workOrder.status}
                        </span>
                      ) : (
                        workOrder[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              {workOrders.length === 0 && (
                <tr>
                  <td colSpan={workOrderColumns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                    No work orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
