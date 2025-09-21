import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useManufacturing } from '../context/ManufacturingContext';
import VoiceCommand from '../components/VoiceCommand';
import Timer from '../components/Timer';

const ManufacturingOrders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    manufacturingOrders, 
    billsOfMaterials, 
    updateOrderStatus, 
    addOrder, 
    updateOrder, 
    deleteOrder, 
    getOrderById, 
    getBOMById 
  } = useManufacturing();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'kanban'
  const [activeFilter, setActiveFilter] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all' or 'my'
  const [voiceListening, setVoiceListening] = useState(false);
  
  // Form data for editing/creating orders
  const [formData, setFormData] = useState({
    reference: '',
    finishedProduct: '',
    quantity: '',
    unit: 'pcs',
    startDate: '',
    endDate: '',
    status: 'Draft',
    billOfMaterial: '',
    assignee: null,
    components: [],
    workOrders: []
  });
  const [timers, setTimers] = useState({}); // Track active timers for work orders

  // State definitions
  const states = ['Draft', 'Confirmed', 'In-Progress', 'To Close', 'Done', 'Cancelled'];
  const currentStateIndex = states.indexOf(formData.status);

  useEffect(() => {
    if (id === 'new') {
      setShowForm(true);
      setSelectedOrder(null);
    } else if (id) {
      const order = getOrderById(id);
      if (order) {
        setSelectedOrder(order);
        setFormData(order);
        setShowForm(true);
      }
    } else {
      setOrders(manufacturingOrders);
      setLoading(false);
    }
  }, [id, manufacturingOrders, getOrderById]);

  // Timer management
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const updatedTimers = { ...prevTimers };
        Object.keys(updatedTimers).forEach(workOrderId => {
          if (updatedTimers[workOrderId].isRunning) {
            updatedTimers[workOrderId].elapsed += 1000;
          }
        });
        return updatedTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Timer functions
  const startTimer = (workOrderId) => {
    setTimers(prev => ({
      ...prev,
      [workOrderId]: {
        isRunning: true,
        elapsed: prev[workOrderId]?.elapsed || 0,
        startTime: Date.now()
      }
    }));
    
    // Update work order status
    setFormData(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(wo => 
        wo.id === workOrderId ? { ...wo, status: 'In-Progress' } : wo
      )
    }));
  };

  const pauseTimer = (workOrderId) => {
    setTimers(prev => ({
      ...prev,
      [workOrderId]: {
        ...prev[workOrderId],
        isRunning: false
      }
    }));
  };

  const stopTimer = (workOrderId) => {
    const timer = timers[workOrderId];
    const realDuration = Math.floor((timer?.elapsed || 0) / 60); // Convert to minutes
    
    setTimers(prev => {
      const updated = { ...prev };
      delete updated[workOrderId];
      return updated;
    });

    // Update work order with final duration and status
    setFormData(prev => ({
      ...prev,
      workOrders: prev.workOrders.map(wo => 
        wo.id === workOrderId ? { 
          ...wo, 
          status: 'Done', 
          realDuration: realDuration 
        } : wo
      )
    }));

    // Check if all work orders are done to transition to "To Close"
    const updatedWorkOrders = formData.workOrders.map(wo => 
      wo.id === workOrderId ? { ...wo, status: 'Done', realDuration: realDuration } : wo
    );
    
    if (updatedWorkOrders.every(wo => wo.status === 'Done') && formData.status === 'In-Progress') {
      setFormData(prev => ({ ...prev, status: 'To Close' }));
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // State transition functions
  const transitionToConfirmed = () => {
    if (validateMandatoryFields()) {
      setFormData(prev => ({ ...prev, status: 'Confirmed' }));
    }
  };

  const transitionToInProgress = () => {
    setFormData(prev => ({ ...prev, status: 'In-Progress' }));
  };

  const transitionToToClose = () => {
    setFormData(prev => ({ ...prev, status: 'To Close' }));
  };

  const transitionToDone = () => {
    setFormData(prev => ({ ...prev, status: 'Done' }));
  };

  const transitionToCancelled = () => {
    setFormData(prev => ({ ...prev, status: 'Cancelled' }));
  };

  // Validation function
  const validateMandatoryFields = () => {
    const requiredFields = ['reference', 'finishedProduct', 'quantity', 'startDate', 'endDate'];
    return requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
  };

  // Check if fields should be read-only
  const isReadOnly = () => {
    return formData.status === 'Cancelled' || 
           (formData.status !== 'Draft' && ['reference', 'finishedProduct', 'quantity', 'unit', 'startDate', 'endDate', 'billOfMaterial'].includes('field'));
  };

  // Load components and work orders from Bill of Material
  const loadBillOfMaterialData = (bomId) => {
    const bom = getBOMById(bomId);
    if (bom) {
      const components = bom.components.map((comp, index) => ({
        id: index + 1,
        name: comp.component,
        availability: Math.floor(Math.random() * 100) + 50, // Mock availability
        toConsume: comp.toConsume,
        consumed: 0
      }));

      const workOrders = bom.workOrders.map((wo, index) => ({
        id: index + 1,
        operation: wo.operation,
        workCenter: wo.workCenter,
        duration: parseInt(wo.duration),
        realDuration: 0,
        status: 'Pending'
      }));

      setFormData(prev => ({
        ...prev,
        components,
        workOrders
      }));
    }
  };

  // Initialize orders from context
  useEffect(() => {
    setOrders(manufacturingOrders);
    setLoading(false);
  }, [manufacturingOrders]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filter, type) => {
    setActiveFilter(filter);
    setFilterType(type);
  };

  const isLate = (order) => {
    const today = new Date();
    const startDate = new Date(order.startDate);
    return startDate < today && order.status === 'Confirmed';
  };

  const isNotAssigned = (order) => {
    return !order.assignee;
  };

  const getFilteredOrders = () => {
    let filtered = orders || [];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.finishedProduct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply state filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'late') {
        filtered = filtered.filter(isLate);
      } else if (activeFilter === 'not-assigned') {
        filtered = filtered.filter(isNotAssigned);
      } else {
        filtered = filtered.filter(order => order.status === activeFilter);
      }
    }

    return filtered;
  };

  const getOrderCounts = () => {
    const allOrders = orders || [];
    const myOrders = allOrders.filter(order => order.assignee === 'John Doe'); // Mock current user

    const allCounts = {
      draft: allOrders.filter(o => o.status === 'Draft').length,
      confirmed: allOrders.filter(o => o.status === 'Confirmed').length,
      inProgress: allOrders.filter(o => o.status === 'In Progress').length,
      toClose: allOrders.filter(o => o.status === 'To Close').length,
      notAssigned: allOrders.filter(isNotAssigned).length,
      late: allOrders.filter(isLate).length
    };

    const myCounts = {
      confirmed: myOrders.filter(o => o.status === 'Confirmed').length,
      inProgress: myOrders.filter(o => o.status === 'In Progress').length,
      toClose: myOrders.filter(o => o.status === 'To Close').length,
      late: myOrders.filter(isLate).length
    };

    return { all: allCounts, my: myCounts };
  };

  const filteredOrders = getFilteredOrders();
  const counts = getOrderCounts();

  const handleCreateOrder = () => {
    setFormData({
      reference: `MO-${Date.now()}`,
      finishedProduct: '',
      quantity: '',
      unit: 'pcs',
      startDate: '',
      endDate: '',
      status: 'Draft',
      billOfMaterial: '',
      assignee: null,
      components: [],
      workOrders: []
    });
    setShowForm(true);
  };

  const handleSaveOrder = async () => {
    try {
      if (selectedOrder) {
        updateOrder(selectedOrder.id, formData);
      } else {
        addOrder(formData);
      }
      setShowForm(false);
      setSelectedOrder(null);
      navigate('/manufacturing-orders');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleConfirmOrder = async (order) => {
    try {
      updateOrderStatus(order.id, 'Confirmed');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const handleStartOrder = async (order) => {
    try {
      updateOrderStatus(order.id, 'In-Progress');
    } catch (error) {
      console.error('Error starting order:', error);
    }
  };

  const handleCancelOrder = async (order) => {
    try {
      updateOrderStatus(order.id, 'Cancelled');
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
    { key: 'reference', header: 'Reference' },
    { key: 'startDate', header: 'Start Date' },
    { key: 'finishedProduct', header: 'Finished Product' },
    { key: 'componentStatus', header: 'Component Status' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'unit', header: 'Unit' },
    { key: 'status', header: 'State' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        {/* State Progress Bar */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-secondary-900 mb-2">Order Status</h2>
            <div className="flex items-center space-x-2">
              {states.map((state, index) => (
                <div key={state} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    index <= currentStateIndex
                      ? 'bg-primary-500 text-white'
                      : 'bg-secondary-200 text-secondary-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    index <= currentStateIndex ? 'text-primary-700' : 'text-secondary-500'
                  }`}>
                    {state}
                  </span>
                  {index < states.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < currentStateIndex ? 'bg-primary-500' : 'bg-secondary-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Header with Action Buttons */}
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
            
            {/* State-specific action buttons */}
            {formData.status === 'Draft' && (
              <button
                onClick={transitionToConfirmed}
                disabled={!validateMandatoryFields()}
                className="btn-primary"
              >
                Confirm
              </button>
            )}
            
            {formData.status === 'Confirmed' && (
              <>
                <button
                  onClick={transitionToInProgress}
                  className="btn-primary"
                >
                  Start
                </button>
                <button
                  onClick={transitionToDone}
                  className="btn-primary"
                >
                  Produce
                </button>
              </>
            )}
            
            {formData.status === 'In-Progress' && (
              <button
                onClick={transitionToDone}
                className="btn-primary"
              >
                Produce
              </button>
            )}
            
            {formData.status !== 'Done' && formData.status !== 'Cancelled' && (
              <button
                onClick={transitionToCancelled}
                className="btn-danger"
              >
                Cancel
              </button>
            )}
            
            <button
              onClick={handleSaveOrder}
              className="btn-primary"
            >
              Save
            </button>
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reference || `MO-${Date.now()}`}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                readOnly={formData.status !== 'Draft'}
                placeholder="Enter order reference"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Finished Product <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.finishedProduct}
                onChange={(e) => setFormData({...formData, finishedProduct: e.target.value})}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                readOnly={formData.status !== 'Draft'}
                placeholder="Enter finished product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  className={`input-field rounded-r-none ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                  readOnly={formData.status !== 'Draft'}
                  placeholder="Enter quantity"
                />
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  className={`input-field rounded-l-none border-l-0 ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                  disabled={formData.status !== 'Draft'}
                >
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                  <option value="m">m</option>
                  <option value="l">l</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bill of Material
              </label>
              <select
                value={formData.billOfMaterial}
                onChange={(e) => {
                  setFormData({...formData, billOfMaterial: e.target.value});
                  if (e.target.value) {
                    loadBillOfMaterialData(e.target.value);
                  }
                }}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                disabled={formData.status !== 'Draft'}
              >
                <option value="">Select Bill of Material</option>
                <option value="bom-001">BOM-001 - Widget Assembly</option>
                <option value="bom-002">BOM-002 - Widget Complete</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                readOnly={formData.status !== 'Draft'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                readOnly={formData.status !== 'Draft'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignee
              </label>
              <select
                value={formData.assignee || ''}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                className={`input-field ${formData.status !== 'Draft' ? 'bg-gray-50' : ''}`}
                disabled={formData.status !== 'Draft'}
              >
                <option value="">Unassigned</option>
                <option value="John Doe">John Doe</option>
                <option value="Jane Smith">Jane Smith</option>
                <option value="Bob Johnson">Bob Johnson</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <input
                type="text"
                value={formData.status}
                className="input-field bg-gray-50"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Components Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Components</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Consume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumed</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.components.map((component, index) => (
                  <tr key={component.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {component.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.availability}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.toConsume}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {component.consumed}
                    </td>
                  </tr>
                ))}
                {formData.components.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No components available. Select a Bill of Material to load components.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {formData.status === 'Draft' && !formData.billOfMaterial && (
            <button 
              className="mt-4 btn-primary"
              onClick={() => {
                const newComponent = {
                  id: Date.now(),
                  name: '',
                  availability: 0,
                  toConsume: 0,
                  consumed: 0
                };
                setFormData(prev => ({
                  ...prev,
                  components: [...prev.components, newComponent]
                }));
              }}
            >
              Add Component
            </button>
          )}
        </div>

        {/* Work Orders Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Work Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Center</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (min)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Real Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.workOrders.map((workOrder, index) => (
                  <tr key={workOrder.id || index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {workOrder.operation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workOrder.workCenter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workOrder.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {timers[workOrder.id] ? formatTime(Math.floor(timers[workOrder.id].elapsed / 1000)) : 
                       workOrder.realDuration ? `${workOrder.realDuration} min` : '00:00:00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        workOrder.status === 'Done' ? 'bg-green-100 text-green-800' :
                        workOrder.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {workOrder.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {workOrder.status === 'Pending' && (
                          <button
                            onClick={() => startTimer(workOrder.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Start
                          </button>
                        )}
                        {workOrder.status === 'In-Progress' && (
                          <>
                            <button
                              onClick={() => pauseTimer(workOrder.id)}
                              className="text-yellow-600 hover:text-yellow-800 font-medium"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => stopTimer(workOrder.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Stop
                            </button>
                          </>
                        )}
                        {workOrder.status === 'Done' && (
                          <span className="text-gray-400">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {formData.workOrders.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No work orders available. Select a Bill of Material to load work orders.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status-specific notes */}
        {formData.status === 'Draft' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> Fill in all mandatory fields (marked with *) before confirming the order.
            </p>
          </div>
        )}
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
        </div>
      </div>

      {/* Search and View Controls */}
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
                placeholder="Search by Reference, Finished Product, or State..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field-with-icon"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-white text-secondary-900 shadow-sm' 
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
                  viewMode === 'kanban' 
                    ? 'bg-white text-secondary-900 shadow-sm' 
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7" />
                </svg>
                Kanban
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* State-Based Filter Dashboard */}
      <div className="card">
        <div className="space-y-4">
          {/* All Orders Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => handleFilterChange('all', 'all')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'all' && filterType === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                All
              </button>
              <span className="text-sm text-secondary-500">({counts.all.draft + counts.all.confirmed + counts.all.inProgress + counts.all.toClose + counts.all.notAssigned + counts.all.late})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('draft', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'draft' && filterType === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Draft ({counts.all.draft})
              </button>
              <button
                onClick={() => handleFilterChange('confirmed', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'confirmed' && filterType === 'all'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Confirmed ({counts.all.confirmed})
              </button>
              <button
                onClick={() => handleFilterChange('inProgress', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'inProgress' && filterType === 'all'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                In Progress ({counts.all.inProgress})
              </button>
              <button
                onClick={() => handleFilterChange('toClose', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'toClose' && filterType === 'all'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                To Close ({counts.all.toClose})
              </button>
              <button
                onClick={() => handleFilterChange('not-assigned', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'not-assigned' && filterType === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                Not Assigned ({counts.all.notAssigned})
              </button>
              <button
                onClick={() => handleFilterChange('late', 'all')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'late' && filterType === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Late ({counts.all.late})
              </button>
            </div>
          </div>

          {/* My Orders Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => handleFilterChange('all', 'my')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'all' && filterType === 'my'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                }`}
              >
                My
              </button>
              <span className="text-sm text-secondary-500">({counts.my.confirmed + counts.my.inProgress + counts.my.toClose + counts.my.late})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('confirmed', 'my')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'confirmed' && filterType === 'my'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Confirmed ({counts.my.confirmed})
              </button>
              <button
                onClick={() => handleFilterChange('inProgress', 'my')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'inProgress' && filterType === 'my'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                }`}
              >
                In Progress ({counts.my.inProgress})
              </button>
              <button
                onClick={() => handleFilterChange('toClose', 'my')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'toClose' && filterType === 'my'
                    ? 'bg-purple-500 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                To Close ({counts.my.toClose})
              </button>
              <button
                onClick={() => handleFilterChange('late', 'my')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeFilter === 'late' && filterType === 'my'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Late ({counts.my.late})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing Orders List */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-secondary-900">
              Manufacturing Orders ({filteredOrders.length})
            </h2>
            <p className="text-secondary-600 text-sm">
              {viewMode === 'list' ? 'List view of manufacturing orders' : 'Kanban view of manufacturing orders'}
            </p>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                      No manufacturing orders found. Create your first order to get started.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          onClick={() => navigate(`/manufacturing-orders/${order.id}`)}
                        >
                          {column.key === 'status' ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Done' ? 'bg-green-100 text-green-800' :
                              order.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order[column.key]}
                            </span>
                          ) : (
                            order[column.key]
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/manufacturing-orders/${order.id}`);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          {order.status === 'Draft' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmOrder(order);
                              }}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Confirm
                            </button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartOrder(order);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Start
                            </button>
                          )}
                          {order.status !== 'Done' && order.status !== 'Cancelled' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelOrder(order);
                              }}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">Kanban View</h3>
            <p className="text-secondary-600">Kanban board view will be implemented in a future update.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturingOrders;
