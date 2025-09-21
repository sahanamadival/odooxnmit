import React, { useState, useEffect } from 'react';
import { productionJobAPI } from '../services/productionJobAPI';
import { orderAPI } from '../services/orderAPI';
import { productAPI } from '../services/productAPI';

const ProductionJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
    product_id: '',
    qty: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobsRes, ordersRes, productsRes] = await Promise.all([
        productionJobAPI.getAllProductionJobs(),
        orderAPI.getAllOrders(),
        productAPI.getAllProducts()
      ]);
      
      setJobs(jobsRes.data);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'qty' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await productionJobAPI.createProductionJob(formData);
      setFormData({
        order_id: '',
        product_id: '',
        qty: 1
      });
      setShowAddForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create production job');
    }
  };

  const updateJobStatus = async (jobId, status) => {
    try {
      await productionJobAPI.updateProductionJobStatus(jobId, { status });
      fetchData();
    } catch (err) {
      setError('Failed to update job status');
    }
  };

  const startJob = async (jobId) => {
    try {
      await productionJobAPI.startProductionJob(jobId);
      fetchData();
    } catch (err) {
      setError('Failed to start job');
    }
  };

  const completeJob = async (jobId) => {
    try {
      await productionJobAPI.completeProductionJob(jobId);
      fetchData();
    } catch (err) {
      setError('Failed to complete job');
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this production job?')) {
      try {
        await productionJobAPI.deleteProductionJob(id);
        fetchData();
      } catch (err) {
        setError('Failed to delete job');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'RUNNING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="p-4">Loading production jobs...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Production Jobs</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Production Job
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add Job Form */}
      {showAddForm && (
        <div className="bg-white p-6 border rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Create Production Job</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                name="order_id"
                value={formData.order_id}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Order</option>
                {orders.map(order => (
                  <option key={order.id} value={order.id}>
                    Order #{order.id} - {order.customer?.name || 'Unknown'} (${order.total_amount})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="qty"
                value={formData.qty}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                min="1"
                required
              />
            </div>
            
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Create Job
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Finished At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{job.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Order #{job.order?.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.product?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {job.qty}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(job.started_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(job.finished_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {job.status === 'PENDING' && (
                    <button
                      onClick={() => startJob(job.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Start
                    </button>
                  )}
                  {job.status === 'RUNNING' && (
                    <button
                      onClick={() => completeJob(job.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Complete
                    </button>
                  )}
                  <select
                    value={job.status}
                    onChange={(e) => updateJobStatus(job.id, e.target.value)}
                    className="text-xs border rounded px-1 py-0.5"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="RUNNING">RUNNING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="text-center py-4 text-gray-500">No production jobs found</div>
        )}
      </div>
    </div>
  );
};

export default ProductionJobs;