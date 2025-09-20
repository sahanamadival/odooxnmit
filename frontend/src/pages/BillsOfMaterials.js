import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { stockAPI } from '../services/stockAPI';

const BillsOfMaterials = () => {
  const [billsOfMaterials, setBillsOfMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBOM, setSelectedBOM] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reference: '',
    product: '',
    quantity: '',
    unit: '',
    materials: []
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadBillsOfMaterials();
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadBillsOfMaterials = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getBillsOfMaterials();
      setBillsOfMaterials(data);
    } catch (error) {
      // Mock data for demo
      setBillsOfMaterials([
        { id: 1, reference: '[001]', product: 'Product 1' },
        { id: 2, reference: '[002]', product: 'Product 2' },
        { id: 3, reference: '[003]', product: 'Product 3' },
        { id: 4, reference: '[004]', product: 'Product 4' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBOMs = (billsOfMaterials || []).filter(bom =>
    bom.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bom.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBOM = () => {
    setFormData({
      reference: '',
      product: '',
      quantity: '',
      unit: '',
      materials: []
    });
    setShowForm(true);
  };

  const handleSaveBOM = async () => {
    try {
      if (selectedBOM) {
        await stockAPI.updateBillOfMaterials(selectedBOM.id, formData);
      } else {
        await stockAPI.createBillOfMaterials(formData);
      }
      setShowForm(false);
      setSelectedBOM(null);
      loadBillsOfMaterials();
    } catch (error) {
      console.error('Error saving BOM:', error);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const columns = [
    { key: 'reference', header: 'Reference' },
    { key: 'product', header: 'Product' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedBOM ? 'Edit Bill of Materials' : 'New Bill of Materials'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleSaveBOM}
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
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                className="input-field"
                placeholder="Enter reference (e.g., [001])"
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
                Unit
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                className="input-field"
              >
                <option value="">Select Unit</option>
                <option value="Pieces">Pieces</option>
                <option value="Kg">Kg</option>
                <option value="Liters">Liters</option>
                <option value="Meters">Meters</option>
                <option value="Boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Materials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="table-header">Material</th>
                    <th className="table-header">Quantity</th>
                    <th className="table-header">Unit</th>
                    <th className="table-header">Cost</th>
                    <th className="table-header">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.materials.map((material, index) => (
                    <tr key={index}>
                      <td className="table-cell">{material.name}</td>
                      <td className="table-cell">{material.quantity}</td>
                      <td className="table-cell">{material.unit}</td>
                      <td className="table-cell">${material.cost}</td>
                      <td className="table-cell">${material.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="mt-4 btn-primary">
              Add Material
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> On new button, create a blank row which can be mapped to manufacturing orders. 
              Anytime field fetch from stock ledger. Populate total final value.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bills of Materials</h1>
        <div className="flex space-x-4">
          <VoiceCommand
            onCommand={handleVoiceCommand}
          />
          <button
            onClick={handleCreateBOM}
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
                placeholder="Search by Finished Product..."
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
          data={filteredBOMs}
          columns={columns}
          onRowClick={(row) => {
            setSelectedBOM(row);
            setFormData({
              ...row,
              reference: row.reference
            });
            setShowForm(true);
          }}
          showActions={false}
        />
      </div>
    </div>
  );
};

export default BillsOfMaterials;
