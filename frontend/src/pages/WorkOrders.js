import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { workOrderAPI } from '../services/workOrderAPI';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    operation: '',
    workCenter: '',
    finishedProduct: '',
    expectedDuration: '',
    realDuration: '',
    status: 'Pending'
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkOrders();
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadWorkOrders = async () => {
    try {
      setLoading(true);
      const data = await workOrderAPI.getWorkOrders();
      setWorkOrders(data);
    } catch (error) {
      // Mock data for demo
      setWorkOrders([
        { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', finishedProduct: 'Product 1', expectedDuration: 180, realDuration: 0, status: 'In Time' },
        { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', finishedProduct: 'Product 2', expectedDuration: 120, realDuration: 0, status: 'In Time' },
        { id: 3, operation: 'Work Order 3', workCenter: 'Work Center 3', finishedProduct: 'Product 3', expectedDuration: 240, realDuration: 180, status: 'In Time' },
        { id: 4, operation: 'Work Order 4', workCenter: 'Work Center 1', finishedProduct: 'Product 4', expectedDuration: 200, realDuration: 220, status: 'Delayed' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredWorkOrders = (workOrders || []).filter(order =>
    order.operation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.finishedProduct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.workCenter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkOrder = () => {
    setFormData({
      operation: '',
      workCenter: '',
      finishedProduct: '',
      expectedDuration: '',
      realDuration: '',
      status: 'Pending'
    });
    setShowForm(true);
  };

  const handleSaveWorkOrder = async () => {
    try {
      if (selectedWorkOrder) {
        await workOrderAPI.updateWorkOrder(selectedWorkOrder.id, formData);
      } else {
        await workOrderAPI.createWorkOrder(formData);
      }
      setShowForm(false);
      setSelectedWorkOrder(null);
      loadWorkOrders();
    } catch (error) {
      console.error('Error saving work order:', error);
    }
  };

  const handleStartWorkOrder = async (workOrder) => {
    try {
      await workOrderAPI.startWorkOrder(workOrder.id);
      loadWorkOrders();
    } catch (error) {
      console.error('Error starting work order:', error);
    }
  };

  const handleCompleteWorkOrder = async (workOrder) => {
    try {
      await workOrderAPI.completeWorkOrder(workOrder.id);
      loadWorkOrders();
    } catch (error) {
      console.error('Error completing work order:', error);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const handleVoiceAction = (action) => {
    switch (action) {
      case 'createWorkOrder':
        handleCreateWorkOrder();
        break;
      default:
        console.log('Action:', action);
    }
  };

  const columns = [
    { key: 'operation', header: 'Overview' },
    { key: 'workCenter', header: 'Work Center' },
    { key: 'finishedProduct', header: 'Finished Product' },
    { key: 'expectedDuration', header: 'Expected Duration' },
    { key: 'realDuration', header: 'Real Duration' },
    { key: 'status', header: 'Status' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedWorkOrder ? 'Edit Work Order' : 'New Work Order'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleSaveWorkOrder}
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
                Operation
              </label>
              <input
                type="text"
                value={formData.operation}
                onChange={(e) => setFormData({...formData, operation: e.target.value})}
                className="input-field"
                placeholder="Enter operation name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Center
              </label>
              <input
                type="text"
                value={formData.workCenter}
                onChange={(e) => setFormData({...formData, workCenter: e.target.value})}
                className="input-field"
                placeholder="Enter work center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finished Product
              </label>
              <input
                type="text"
                value={formData.finishedProduct}
                onChange={(e) => setFormData({...formData, finishedProduct: e.target.value})}
                className="input-field"
                placeholder="Enter finished product"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.expectedDuration}
                onChange={(e) => setFormData({...formData, expectedDuration: e.target.value})}
                className="input-field"
                placeholder="Enter expected duration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real Duration (minutes)
              </label>
              <input
                type="number"
                value={formData.realDuration}
                onChange={(e) => setFormData({...formData, realDuration: e.target.value})}
                className="input-field"
                placeholder="Enter real duration"
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
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="In Time">In Time</option>
                <option value="Delayed">Delayed</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Work Orders</h1>
        <div className="flex space-x-4">
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onAction={handleVoiceAction}
          />
          <button
            onClick={handleCreateWorkOrder}
            className="btn-primary"
          >
            New
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Operation or Finished Product..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <OrderTable
          data={filteredWorkOrders}
          columns={columns}
          onRowClick={(row) => setSelectedWorkOrder(row)}
          onStart={handleStartWorkOrder}
          onComplete={handleCompleteWorkOrder}
          onEdit={(row) => {
            setSelectedWorkOrder(row);
            setFormData({
              ...row,
              operation: row.operation
            });
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
};

export default WorkOrders;
