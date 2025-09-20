import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { manufacturingAPI } from '../services/manufacturingAPI';

const ManufacturingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    startDate: '',
    endDate: '',
    status: 'New',
    components: []
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await manufacturingAPI.getManufacturingOrders();
      setOrders(data);
    } catch (error) {
      // Mock data for demo
      setOrders([
        { id: 1, orderId: 'MO-001', product: 'Product 1', quantity: 100, startDate: '2024-01-15', endDate: '2024-01-20', status: 'New', progress: 0, goalDate: '2024-01-20' },
        { id: 2, orderId: 'MO-002', product: 'Product 2', quantity: 50, startDate: '2024-01-16', endDate: '2024-01-22', status: 'In Progress', progress: 45, goalDate: '2024-01-22' },
        { id: 3, orderId: 'MO-003', product: 'Product 3', quantity: 75, startDate: '2024-01-10', endDate: '2024-01-18', status: 'Completed', progress: 100, goalDate: '2024-01-18' },
        { id: 4, orderId: 'MO-004', product: 'Product 4', quantity: 200, startDate: '2024-01-20', endDate: '2024-01-25', status: 'Cancelled', progress: 0, goalDate: '2024-01-25' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = (orders || []).filter(order =>
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOrder = () => {
    setFormData({
      product: '',
      quantity: '',
      startDate: '',
      endDate: '',
      status: 'New',
      components: []
    });
    setShowForm(true);
  };

  const handleSaveOrder = async () => {
    try {
      if (selectedOrder) {
        await manufacturingAPI.updateManufacturingOrder(selectedOrder.id, formData);
      } else {
        await manufacturingAPI.createManufacturingOrder(formData);
      }
      setShowForm(false);
      setSelectedOrder(null);
      loadOrders();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleConfirmOrder = async (order) => {
    try {
      await manufacturingAPI.confirmManufacturingOrder(order.id);
      loadOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleStartOrder = async (order) => {
    try {
      await manufacturingAPI.startManufacturingOrder(order.id);
      loadOrders();
    } catch (error) {
      console.error('Error starting order:', error);
    }
  };

  const handleCancelOrder = async (order) => {
    try {
      await manufacturingAPI.cancelManufacturingOrder(order.id);
      loadOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const handleVoiceAction = (action) => {
    switch (action) {
      case 'createManufacturingOrder':
        handleCreateOrder();
        break;
      default:
        console.log('Action:', action);
    }
  };

  const columns = [
    { key: 'orderId', header: 'Order ID' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'endDate', header: 'End Date' },
    { key: 'status', header: 'Status' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedOrder ? 'Edit Manufacturing Order' : 'New Manufacturing Order'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleSaveOrder}
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order ID
              </label>
              <input
                type="text"
                value={formData.orderId || `MO-${Date.now()}`}
                readOnly
                className="input-field bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                className="input-field"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="input-field"
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="input-field"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Components</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Component</th>
                    <th className="table-header">Quantity</th>
                    <th className="table-header">% Consumption</th>
                    <th className="table-header">Unit</th>
                    <th className="table-header">Work Orders</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.components.map((component, index) => (
                    <tr key={index}>
                      <td className="table-cell">{component.name}</td>
                      <td className="table-cell">{component.quantity}</td>
                      <td className="table-cell">{component.consumption}%</td>
                      <td className="table-cell">{component.unit}</td>
                      <td className="table-cell">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          View Work Orders
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 btn-primary">
              Add Component
            </button>
          </div>

          {formData.status === 'New' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Ancillary fields should be colored before creating Manufacturing Order.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Manufacturing Orders</h1>
          <p className="text-secondary-600 mt-1">Manage and track your manufacturing operations</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onAction={handleVoiceAction}
          />
          <button
            onClick={handleCreateOrder}
            className="btn-primary btn-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Order
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex-1 max-w-lg">
            <div className="input-group">
              <div className="input-icon">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Order ID, Product, or Status..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field-with-icon"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button className="btn-outline btn-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter
            </button>
            <button className="btn-outline btn-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Orders ({filteredOrders.length})
            </h2>
            <p className="text-secondary-600 text-sm">All manufacturing orders and their current status</p>
          </div>
        </div>

        <OrderTable
          data={filteredOrders}
          columns={columns}
          onRowClick={(row) => setSelectedOrder(row)}
          onStart={handleStartOrder}
          onCancel={handleCancelOrder}
          onEdit={(row) => {
            setSelectedOrder(row);
            setFormData({
              ...row,
              orderId: row.orderId
            });
            setShowForm(true);
          }}
          loading={loading}
          emptyMessage="No manufacturing orders found. Create your first order to get started."
        />
      </div>
    </div>
  );
};

export default ManufacturingOrders;
