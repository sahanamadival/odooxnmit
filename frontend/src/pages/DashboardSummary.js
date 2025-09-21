import React, { useState, useEffect } from 'react';
import { inventoryAPI } from '../services/inventoryAPI';
import { orderAPI } from '../services/orderAPI';
import { productionJobAPI } from '../services/productionJobAPI';

const DashboardSummary = () => {
  const [inventorySummary, setInventorySummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, ordersRes, jobsRes] = await Promise.all([
        inventoryAPI.getInventorySummary(),
        orderAPI.getAllOrders(),
        productionJobAPI.getAllProductionJobs()
      ]);
      
      setInventorySummary(inventoryRes.data);
      setRecentOrders(ordersRes.data.slice(0, 5)); // Get last 5 orders
      setRecentJobs(jobsRes.data.slice(0, 5)); // Get last 5 jobs
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'RUNNING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'DELIVERED': 'bg-purple-100 text-purple-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manufacturing Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {inventorySummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{inventorySummary.totalProducts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Inventory Value</h3>
            <p className="text-3xl font-bold text-green-600">
              ${parseFloat(inventorySummary.totalInventoryValue).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Low Stock Items</h3>
            <p className="text-3xl font-bold text-red-600">{inventorySummary.lowStockProducts.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-purple-600">{recentOrders.length}</p>
          </div>
        </div>
      )}

      {/* Low Stock Alert */}
      {inventorySummary && inventorySummary.lowStockProducts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>The following products are running low on stock:</p>
                <ul className="list-disc list-inside mt-1">
                  {inventorySummary.lowStockProducts.map(product => (
                    <li key={product.id}>
                      {product.name} ({product.sku}) - Only {product.stock} units left
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${parseFloat(order.total_amount).toFixed(2)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No recent orders</p>
            )}
          </div>
        </div>

        {/* Recent Production Jobs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Recent Production Jobs</h2>
          </div>
          <div className="p-6">
            {recentJobs.length > 0 ? (
              <div className="space-y-3">
                {recentJobs.map(job => (
                  <div key={job.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Job #{job.id}</p>
                      <p className="text-sm text-gray-600">
                        {job.product?.name} - Qty: {job.qty}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                      {job.started_at && (
                        <p className="text-xs text-gray-500 mt-1">
                          Started: {new Date(job.started_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No recent production jobs</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 text-center"
          >
            <div className="text-2xl mb-2">📦</div>
            <div>Manage Products</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/orders'}
            className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 text-center"
          >
            <div className="text-2xl mb-2">📋</div>
            <div>Manage Orders</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/production-jobs'}
            className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 text-center"
          >
            <div className="text-2xl mb-2">🏭</div>
            <div>Production Jobs</div>
          </button>
          
          <button
            onClick={() => window.location.href = '/inventory'}
            className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 text-center"
          >
            <div className="text-2xl mb-2">📊</div>
            <div>Inventory Reports</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;