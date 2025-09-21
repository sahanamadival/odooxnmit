import React, { useState, useEffect, useCallback } from 'react';
import VoiceCommand from '../components/VoiceCommand';
import { workOrderAPI } from '../services/workOrderAPI';

const Reports = () => {
  const [workOrderAnalysis, setWorkOrderAnalysis] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    operation: '',
    workCenter: '',
    status: ''
  });
  const [filteredData, setFilteredData] = useState([]);

  const loadWorkOrderAnalysis = useCallback(async () => {
    try {
      // setLoading(true);
      const data = await workOrderAPI.getWorkOrderAnalysis(filters);
      setWorkOrderAnalysis(data);
    } catch (error) {
      // Mock data for demo - enhanced with realistic work order data
      setWorkOrderAnalysis([
        { 
          id: 1, 
          operation: 'Assembly', 
          workCenter: 'Assembly Line 1', 
          product: 'Widget A', 
          quantity: 50, 
          expectedDuration: 180, 
          realDuration: 175, 
          status: 'Completed',
          manufacturingOrderId: 'MO-001'
        },
        { 
          id: 2, 
          operation: 'Quality Check', 
          workCenter: 'QC Station', 
          product: 'Widget A', 
          quantity: 50, 
          expectedDuration: 30, 
          realDuration: 28, 
          status: 'Completed',
          manufacturingOrderId: 'MO-001'
        },
        { 
          id: 3, 
          operation: 'Packaging', 
          workCenter: 'Packaging Line', 
          product: 'Widget A', 
          quantity: 50, 
          expectedDuration: 45, 
          realDuration: 42, 
          status: 'Completed',
          manufacturingOrderId: 'MO-001'
        },
        { 
          id: 4, 
          operation: 'Assembly', 
          workCenter: 'Assembly Line 2', 
          product: 'Widget B', 
          quantity: 25, 
          expectedDuration: 120, 
          realDuration: 135, 
          status: 'Delayed',
          manufacturingOrderId: 'MO-002'
        },
        { 
          id: 5, 
          operation: 'Welding', 
          workCenter: 'Welding Station', 
          product: 'Widget C', 
          quantity: 10, 
          expectedDuration: 90, 
          realDuration: 0, 
          status: 'In Progress',
          manufacturingOrderId: 'MO-003'
        },
        { 
          id: 6, 
          operation: 'Painting', 
          workCenter: 'Paint Booth', 
          product: 'Widget C', 
          quantity: 10, 
          expectedDuration: 60, 
          realDuration: 0, 
          status: 'Pending',
          manufacturingOrderId: 'MO-003'
        },
        { 
          id: 7, 
          operation: 'Assembly', 
          workCenter: 'Assembly Line 1', 
          product: 'Widget D', 
          quantity: 100, 
          expectedDuration: 200, 
          realDuration: 195, 
          status: 'Completed',
          manufacturingOrderId: 'MO-004'
        },
        { 
          id: 8, 
          operation: 'Testing', 
          workCenter: 'Test Lab', 
          product: 'Widget D', 
          quantity: 100, 
          expectedDuration: 75, 
          realDuration: 80, 
          status: 'Delayed',
          manufacturingOrderId: 'MO-004'
        }
      ]);
    } finally {
      // setLoading(false);
    }
  }, [filters]);

  // Apply both search and filters
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = workOrderAnalysis || [];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.operation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workCenter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply individual filters
    if (filters.operation) {
      filtered = filtered.filter(item =>
        item.operation?.toLowerCase().includes(filters.operation.toLowerCase())
      );
    }

    if (filters.workCenter) {
      filtered = filtered.filter(item =>
        item.workCenter?.toLowerCase().includes(filters.workCenter.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(item =>
        item.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    setFilteredData(filtered);
  }, [searchTerm, filters, workOrderAnalysis]);

  useEffect(() => {
    loadWorkOrderAnalysis();
  }, [loadWorkOrderAnalysis]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Update filtered data when search term or filters change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [applyFiltersAndSearch]);

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
    { key: 'expectedDuration', header: 'Expected Duration (min)' },
    { key: 'realDuration', header: 'Real Duration (min)' },
    { key: 'status', header: 'Status' }
  ];

  // Calculate summary for filtered data
  const totalExpectedDuration = filteredData.reduce((sum, item) => sum + (item.expectedDuration || 0), 0);
  const totalRealDuration = filteredData.reduce((sum, item) => sum + (item.realDuration || 0), 0);

  // Format duration for display
  const formatDuration = (minutes) => {
    if (minutes === 0) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Create summary row data
  const summaryRow = {
    id: 'summary',
    operation: 'TOTAL',
    workCenter: '',
    product: '',
    quantity: filteredData.reduce((sum, item) => sum + (item.quantity || 0), 0),
    expectedDuration: totalExpectedDuration,
    realDuration: totalRealDuration,
    status: '',
    isSummary: true
  };

  // Combine filtered data with summary row
  const tableData = [...filteredData, summaryRow];

  return (
    <div className="space-y-6">
      {/* Header with Search Bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Work Orders Analysis</h1>
          <p className="text-gray-600 mt-1">Track and analyze work order performance</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Operation, Work Center, Product, or Status..."
              value={searchTerm}
              onChange={handleSearch}
              className="input-field pl-10 w-80"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <VoiceCommand
            onCommand={handleVoiceCommand}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h2>
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
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => {
              setFilters({ operation: '', workCenter: '', status: '' });
              setSearchTerm('');
            }}
            className="btn-secondary"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((item, index) => (
                <tr 
                  key={item.id} 
                  className={`${item.isSummary ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.operation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.workCenter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(item.expectedDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDuration(item.realDuration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800">
                Showing <span className="font-semibold">{filteredData.length}</span> work orders
                {searchTerm && ` matching "${searchTerm}"`}
                {(filters.operation || filters.workCenter || filters.status) && ' with applied filters'}
              </p>
            </div>
            <div className="text-sm text-blue-800">
              <span className="font-semibold">Total Duration:</span> {formatDuration(totalExpectedDuration)} expected, {formatDuration(totalRealDuration)} actual
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
