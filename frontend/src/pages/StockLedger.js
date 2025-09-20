import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrderTable from '../components/OrderTable';
import VoiceCommand from '../components/VoiceCommand';
import { stockAPI } from '../services/stockAPI';

const StockLedger = () => {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product: '',
    unitCost: '',
    unit: '',
    totalValue: '',
    onHand: '',
    freeToUse: '',
    incoming: '',
    outgoing: ''
  });
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadStockItems();
    const action = searchParams.get('action');
    if (action === 'create') {
      setShowForm(true);
    }
  }, [searchParams]);

  const loadStockItems = async () => {
    try {
      setLoading(true);
      const data = await stockAPI.getStockItems();
      setStockItems(data);
    } catch (error) {
      // Mock data for demo
      setStockItems([
        { id: 1, product: 'Product 1', unitCost: 25.50, unit: 'Pieces', totalValue: 2550, onHand: 100, freeToUse: 80, incoming: 20, outgoing: 0 },
        { id: 2, product: 'Product 2', unitCost: 15.75, unit: 'Pieces', totalValue: 1575, onHand: 100, freeToUse: 100, incoming: 0, outgoing: 0 },
        { id: 3, product: 'Product 3', unitCost: 45.00, unit: 'Pieces', totalValue: 4500, onHand: 100, freeToUse: 60, incoming: 40, outgoing: 0 },
        { id: 4, product: 'Product 4', unitCost: 12.25, unit: 'Pieces', totalValue: 1225, onHand: 100, freeToUse: 100, incoming: 0, outgoing: 0 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStockItems = (stockItems || []).filter(item =>
    item.product?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateItem = () => {
    setFormData({
      product: '',
      unitCost: '',
      unit: '',
      totalValue: '',
      onHand: '',
      freeToUse: '',
      incoming: '',
      outgoing: ''
    });
    setShowForm(true);
  };

  const handleSaveItem = async () => {
    try {
      if (selectedItem) {
        await stockAPI.updateStockItem(selectedItem.id, formData);
      } else {
        await stockAPI.createStockItem(formData);
      }
      setShowForm(false);
      setSelectedItem(null);
      loadStockItems();
    } catch (error) {
      console.error('Error saving stock item:', error);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearchTerm(data);
    }
  };

  const handleVoiceAction = (action) => {
    switch (action) {
      case 'createStockItem':
        handleCreateItem();
        break;
      default:
        console.log('Action:', action);
    }
  };

  const columns = [
    { key: 'product', header: 'Product' },
    { key: 'unitCost', header: 'Unit Cost' },
    { key: 'unit', header: 'Unit' },
    { key: 'totalValue', header: 'Total Value' },
    { key: 'onHand', header: 'On Hand' },
    { key: 'freeToUse', header: 'Free to Use' },
    { key: 'incoming', header: 'Incoming' },
    { key: 'outgoing', header: 'Outgoing' }
  ];

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedItem ? 'Edit Product' : 'New Product'}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Back
            </button>
            <button
              onClick={handleSaveItem}
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
                Unit Cost
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.unitCost}
                onChange={(e) => setFormData({...formData, unitCost: e.target.value})}
                className="input-field"
                placeholder="Enter unit cost"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Value
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.totalValue}
                onChange={(e) => setFormData({...formData, totalValue: e.target.value})}
                className="input-field"
                placeholder="Enter total value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                On Hand
              </label>
              <input
                type="number"
                value={formData.onHand}
                onChange={(e) => setFormData({...formData, onHand: e.target.value})}
                className="input-field bg-gray-50"
                placeholder="On hand quantity"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Free to Use
              </label>
              <input
                type="number"
                value={formData.freeToUse}
                onChange={(e) => setFormData({...formData, freeToUse: e.target.value})}
                className="input-field"
                placeholder="Enter free to use quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incoming
              </label>
              <input
                type="number"
                value={formData.incoming}
                onChange={(e) => setFormData({...formData, incoming: e.target.value})}
                className="input-field"
                placeholder="Enter incoming quantity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outgoing
              </label>
              <input
                type="number"
                value={formData.outgoing}
                onChange={(e) => setFormData({...formData, outgoing: e.target.value})}
                className="input-field"
                placeholder="Enter outgoing quantity"
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> On hand and unit fields are read-only. Total value is calculated automatically.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stock Ledger</h1>
        <div className="flex space-x-4">
          <VoiceCommand
            onCommand={handleVoiceCommand}
            onAction={handleVoiceAction}
          />
          <button
            onClick={handleCreateItem}
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
                placeholder="Search by Product..."
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
          data={filteredStockItems}
          columns={columns}
          onRowClick={(row) => setSelectedItem(row)}
          onEdit={(row) => {
            setSelectedItem(row);
            setFormData({
              ...row,
              product: row.product
            });
            setShowForm(true);
          }}
        />
      </div>
    </div>
  );
};

export default StockLedger;
