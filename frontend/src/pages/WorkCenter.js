import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { stockAPI } from '../services/stockAPI';

const WorkCenter = () => {
  const [workCenters, setWorkCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkCenter, setSelectedWorkCenter] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    workCenter: '',
    costPerHour: ''
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkCenters();
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadWorkCenters = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getWorkCenters();
      setWorkCenters(data);
    } catch (error) {
      // Mock data for demo
      setWorkCenters([
        { id: 1, workCenter: 'Work Center 1', costPerHour: 50 },
        { id: 2, workCenter: 'Work Center 2', costPerHour: 75 },
        { id: 3, workCenter: 'Work Center 3', costPerHour: 60 },
        { id: 4, workCenter: 'Work Center 4', costPerHour: 45 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredWorkCenters = (workCenters || []).filter(center =>
    center.workCenter?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateWorkCenter = () => {
    setFormData({
      workCenter: '',
      costPerHour: ''
    });
    setShowForm(true);
  };

  const handleSaveWorkCenter = async () => {
    try {
      if (selectedWorkCenter) {
        await stockAPI.updateWorkCenter(selectedWorkCenter.id, formData);
      } else {
        await stockAPI.createWorkCenter(formData);
      }
      setShowForm(false);
      setSelectedWorkCenter(null);
      loadWorkCenters();
    } catch (error) {
      console.error('Error saving work center:', error);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const columns = [
    { key: 'workCenter', header: 'Work Center' },
    { key: 'costPerHour', header: 'Cost per hour' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedWorkCenter ? 'Edit Work Center' : 'New Work Center'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleSaveWorkCenter}
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
                Work Center
              </label>
              <input
                type="text"
                value={formData.workCenter}
                onChange={(e) => setFormData({...formData, workCenter: e.target.value})}
                className="input-field"
                placeholder="Enter work center name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Hour
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.costPerHour}
                onChange={(e) => setFormData({...formData, costPerHour: e.target.value})}
                className="input-field"
                placeholder="Enter cost per hour"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Work Center</h1>
        <div className="flex space-x-4">
          <VoiceCommand
            onCommand={handleVoiceCommand}
          />
          <button
            onClick={handleCreateWorkCenter}
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
                placeholder="Search by Work Center..."
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
          data={filteredWorkCenters}
          columns={columns}
          onRowClick={(row) => {
            setSelectedWorkCenter(row);
            setFormData({
              ...row,
              workCenter: row.workCenter
            });
            setShowForm(true);
          }}
          onEdit={(row) => {
            setSelectedWorkCenter(row);
            setFormData({
              ...row,
              workCenter: row.workCenter
            });
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
};

export default WorkCenter;
