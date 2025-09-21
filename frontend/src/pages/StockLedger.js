import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useManufacturing } from '../context/ManufacturingContext';
import VoiceCommand from '../components/VoiceCommand';

const StockLedger = () => {
  const { stockItems, addStockItem, updateStockItem, deleteStockItem } = useManufacturing();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [stockFilter, setStockFilter] = useState('all');
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    product: '',
    unitCost: '',
    unit: 'pcs',
    onHand: '',
    freeToUse: '',
    incoming: '',
    outgoing: ''
  });
  
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params.mode === 'new') {
      setShowForm(true);
      setSelectedItem(null);
    }
  }, [params]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleVoiceCommand = useCallback((type, data) => {
    switch (type) {
      case 'search':
        setSearchTerm(data);
        break;
      case 'filter':
        if (['all', 'low-stock', 'high-value', 'out-of-stock'].includes(data)) {
          setStockFilter(data);
        }
        break;
      case 'view':
        if (['list', 'kanban'].includes(data)) {
          setViewMode(data);
        }
        break;
      default:
        console.log('Voice command:', type, data);
    }
  }, []);

  const handleVoiceNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  const handleCreateItem = useCallback(() => {
    navigate('/stock-ledger/new');
  }, [navigate]);

  const handleVoiceAction = useCallback((action) => {
    switch (action) {
      case 'create':
      case 'new':
        handleCreateItem();
        break;
      case 'toggle-voice':
        setShowVoiceCommands(!showVoiceCommands);
        break;
      default:
        console.log('Voice action:', action);
    }
  }, [showVoiceCommands, handleCreateItem]);

  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!formData.product.trim()) {
      errors.product = 'Product name is required';
    }
    
    if (!formData.unitCost || parseFloat(formData.unitCost) <= 0) {
      errors.unitCost = 'Unit cost must be greater than 0';
    }
    
    if (formData.onHand && parseInt(formData.onHand) < 0) {
      errors.onHand = 'On hand quantity cannot be negative';
    }
    
    if (formData.freeToUse && parseInt(formData.freeToUse) < 0) {
      errors.freeToUse = 'Free to use quantity cannot be negative';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setSelectedItem(null);
    setFormErrors({});
    setFormData({
      product: '',
      unitCost: '',
      unit: 'pcs',
      onHand: '',
      freeToUse: '',
      incoming: '',
      outgoing: ''
    });
    navigate('/stock-ledger');
  }, [navigate]);

  const filteredStockItems = stockItems.filter(item => {
    const matchesSearch = item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      switch (stockFilter) {
        case 'low-stock':
          return item.onHand <= 20;
        case 'high-value':
          return item.totalValue >= 10000;
        case 'out-of-stock':
          return item.onHand === 0;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesFilter;
  });

  const handleEditItem = useCallback((item) => {
    setSelectedItem(item);
    setFormData({
      product: item.product,
      unitCost: item.unitCost.toString(),
      unit: item.unit,
      onHand: item.onHand.toString(),
      freeToUse: item.freeToUse.toString(),
      incoming: item.incoming.toString(),
      outgoing: item.outgoing.toString()
    });
    setFormErrors({});
    setShowForm(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!validateForm()) {
      return;
    }
    
    const stockData = {
      product: formData.product.trim(),
      unitCost: parseFloat(formData.unitCost) || 0,
      unit: formData.unit,
      onHand: parseInt(formData.onHand) || 0,
      freeToUse: parseInt(formData.freeToUse) || 0,
      incoming: parseInt(formData.incoming) || 0,
      outgoing: parseInt(formData.outgoing) || 0
    };

    if (selectedItem) {
      updateStockItem(selectedItem.id, stockData);
    } else {
      addStockItem(stockData);
    }

    handleCancel();
  }, [formData, selectedItem, validateForm, updateStockItem, addStockItem, handleCancel]);

  const handleDelete = useCallback((item) => {
    if (window.confirm(`Are you sure you want to delete ${item.product}?`)) {
      deleteStockItem(item.id);
    }
  }, [deleteStockItem]);

  const getStockStatus = (item) => {
    if (item.onHand === 0) return 'out-of-stock';
    if (item.onHand <= 20) return 'low-stock';
    if (item.onHand > 100) return 'in-stock';
    return 'medium-stock';
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'out-of-stock':
        return 'bg-danger-100 text-danger-800';
      case 'low-stock':
        return 'bg-warning-100 text-warning-800';
      case 'medium-stock':
        return 'bg-info-100 text-info-800';
      case 'in-stock':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const stockSummary = {
    total: stockItems.length,
    lowStock: stockItems.filter(item => item.onHand <= 20).length,
    outOfStock: stockItems.filter(item => item.onHand === 0).length,
    highValue: stockItems.filter(item => item.totalValue >= 10000).length
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(value);
  };

  if (showForm) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              {selectedItem ? 'Edit Stock Item' : 'Add Stock Item'}
            </h1>
            <p className="text-secondary-600 mt-1">Manage inventory stock levels and information</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary" disabled={!formData.product || !formData.unitCost}>
              {selectedItem ? 'Update' : 'Save'}
            </button>
          </div>
        </div>

        {showVoiceCommands && (
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onNavigate={handleVoiceNavigation}
            onAction={handleVoiceAction}
          />
        )}

        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
                className={`input-field ${formErrors.product ? 'border-danger-500' : ''}`}
                placeholder="Enter product name"
                required
              />
              {formErrors.product && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.product}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Unit Cost (₹) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({...formData, unitCost: e.target.value})}
                className={`input-field ${formErrors.unitCost ? 'border-danger-500' : ''}`}
                placeholder="Enter unit cost"
                required
              />
              {formErrors.unitCost && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.unitCost}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="input-field"
              >
                <option value="pcs">Pieces</option>
                <option value="kg">Kilograms</option>
                <option value="liters">Liters</option>
                <option value="meters">Meters</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">On Hand Quantity</label>
              <input
                type="number"
                value={formData.onHand}
                onChange={(e) => setFormData({...formData, onHand: e.target.value})}
                className={`input-field ${formErrors.onHand ? 'border-danger-500' : ''}`}
                placeholder="Enter on hand quantity"
              />
              {formErrors.onHand && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.onHand}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Free to Use</label>
              <input
                type="number"
                value={formData.freeToUse}
                onChange={(e) => setFormData({...formData, freeToUse: e.target.value})}
                className={`input-field ${formErrors.freeToUse ? 'border-danger-500' : ''}`}
                placeholder="Enter free to use quantity"
              />
              {formErrors.freeToUse && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.freeToUse}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Incoming</label>
              <input
                type="number"
                value={formData.incoming}
                onChange={(e) => setFormData({...formData, incoming: e.target.value})}
                className="input-field"
                placeholder="Enter incoming quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Outgoing</label>
              <input
                type="number"
                value={formData.outgoing}
                onChange={(e) => setFormData({...formData, outgoing: e.target.value})}
                className="input-field"
                placeholder="Enter outgoing quantity"
              />
            </div>
          </div>

          {formData.unitCost && formData.onHand && (
            <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <p className="text-primary-800 text-sm">
                <strong>Total Value:</strong> {formatCurrency(parseFloat(formData.unitCost) * parseInt(formData.onHand))}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Stock Ledger</h1>
          <p className="text-secondary-600 mt-1">Manage inventory stock levels and track material availability</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowVoiceCommands(!showVoiceCommands)} 
            className={`btn-secondary ${showVoiceCommands ? 'bg-primary-100 text-primary-700' : ''}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Voice Commands
          </button>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')} 
            className="btn-secondary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={viewMode === 'list' ? "M4 6h16M4 10h16M4 14h16M4 18h16" : "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"} 
              />
            </svg>
            {viewMode === 'list' ? 'Kanban View' : 'List View'}
          </button>
          <button onClick={handleCreateItem} className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Stock Item
          </button>
        </div>
      </div>

      {showVoiceCommands && (
        <VoiceCommand
          onCommand={handleVoiceCommand}
          onNavigate={handleVoiceNavigation}
          onAction={handleVoiceAction}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Total Items</p>
              <p className="text-2xl font-bold text-secondary-900">{stockSummary.total}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-warning-100 rounded-lg">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Low Stock</p>
              <p className="text-2xl font-bold text-warning-600">{stockSummary.lowStock}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-danger-100 rounded-lg">
              <svg className="w-6 h-6 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">Out of Stock</p>
              <p className="text-2xl font-bold text-danger-600">{stockSummary.outOfStock}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-success-100 rounded-lg">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">High Value</p>
              <p className="text-2xl font-bold text-success-600">{stockSummary.highValue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by product name, unit, or ID..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                stockFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStockFilter('low-stock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                stockFilter === 'low-stock'
                  ? 'bg-warning-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('high-value')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                stockFilter === 'high-value'
                  ? 'bg-success-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              High Value
            </button>
            <button
              onClick={() => setStockFilter('out-of-stock')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                stockFilter === 'out-of-stock'
                  ? 'bg-danger-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              Out of Stock
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {filteredStockItems.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-secondary-900 mb-1">No stock items found</h3>
            <p className="text-secondary-500 mb-4">
              {stockFilter !== 'all' 
                ? `No items match the "${stockFilter.replace('-', ' ')}" filter.` 
                : 'Get started by adding your first stock item.'}
            </p>
            <button onClick={handleCreateItem} className="btn-primary">Add Stock Item</button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Unit Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Stock Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Free to Use</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Incoming</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Outgoing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredStockItems.map((item) => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-secondary-900">{item.product}</div>
                        <div className="text-sm text-secondary-500">{item.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{item.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {formatCurrency(item.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(status)}`}>
                          {item.onHand} {item.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{item.freeToUse}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{item.incoming}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{item.outgoing}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditItem(item)} className="text-primary-600 hover:text-primary-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDelete(item)} className="text-danger-600 hover:text-danger-900">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filteredStockItems.map((item) => {
              const status = getStockStatus(item);
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md border border-secondary-200 p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-secondary-900 truncate">{item.product}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(status)}`}>
                      {status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-secondary-600">
                    <div className="flex justify-between">
                      <span>Unit Cost:</span>
                      <span className="font-medium">{formatCurrency(item.unitCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-medium text-secondary-900">{formatCurrency(item.totalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On Hand:</span>
                      <span className="font-medium">{item.onHand} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available:</span>
                      <span className="font-medium">{item.freeToUse} {item.unit}</span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button onClick={() => handleEditItem(item)} className="text-primary-600 hover:text-primary-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(item)} className="text-danger-600 hover:text-danger-900">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockLedger;