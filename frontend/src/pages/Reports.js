import React, { useState, useEffect } from 'react';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { workOrderAPI } from '../services/workOrderAPI';

const Reports = () => {
  const [workOrderAnalysis, setWorkOrderAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    operation: '',
    workCenter: '',
    status: ''
  });

  useEffect(() => {
    loadWorkOrderAnalysis();
  }, []);

  const loadWorkOrderAnalysis = async () => {
    try {
      setLoading(true);
      const data = await workOrderAPI.getWorkOrderAnalysis(filters);
      setWorkOrderAnalysis(data);
    } catch (error) {
      // Mock data for demo
      setWorkOrderAnalysis([
        { id: 1, operation: 'Work Order 1', workCenter: 'Work Center 1', product: 'Product 1', quantity: 3, expectedDuration: 180, realDuration: 0, status: 'In Time' },
        { id: 2, operation: 'Work Order 2', workCenter: 'Work Center 2', product: 'Product 2', quantity: 2, expectedDuration: 120, realDuration: 0, status: 'In Time' },
        { id: 3, operation: 'Work Order 3', workCenter: 'Work Center 3', product: 'Product 3', quantity: 1, expectedDuration: 240, realDuration: 180, status: 'In Time' },
        { id: 4, operation: 'Work Order 4', workCenter: 'Work Center 1', product: 'Product 4', quantity: 4, expectedDuration: 200, realDuration: 220, status: 'Delayed' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredAnalysis = (workOrderAnalysis || []).filter(item =>
    item.operation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.workCenter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const columns = [
    { key: 'operation', header: 'Operation' },
    { key: 'workCenter', header: 'Work Center' },
    { key: 'product', header: 'Product' },
    { key: 'quantity', header: 'Quantity' },
    { key: 'expectedDuration', header: 'Expected Duration' },
    { key: 'realDuration', header: 'Real Duration' },
    { key: 'status', header: 'Status' }
  ];

  // Calculate summary
  const totalExpectedDuration = workOrderAnalysis.reduce((sum, item) => sum + (item.expectedDuration || 0), 0);
  const totalRealDuration = workOrderAnalysis.reduce((sum, item) => sum + (item.realDuration || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Work Orders Analysis</h1>
        <VoiceCommand
          onCommand={handleVoiceCommand}
        />
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <input
              type="text"
              value={filters.operation}
              onChange={(e) => handleFilterChange('operation', e.target.value)}
              className="input-field"
              placeholder="Filter by operation"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Center
            </label>
            <input
              type="text"
              value={filters.workCenter}
              onChange={(e) => handleFilterChange('workCenter', e.target.value)}
              className="input-field"
              placeholder="Filter by work center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="In Time">In Time</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={loadWorkOrderAnalysis}
            className="btn-primary"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setFilters({ operation: '', workCenter: '', status: '' });
              setSearchTerm('');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Operation, Work Center, or Status..."
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
          data={filteredAnalysis}
          columns={columns}
          showActions={false}
        />

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Expected Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.floor(totalExpectedDuration / 60)}:{(totalExpectedDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Real Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.floor(totalRealDuration / 60)}:{(totalRealDuration % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
