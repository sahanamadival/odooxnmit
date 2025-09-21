import React, { useState, useEffect, useRef } from 'react';
import { useManufacturing } from '../context/ManufacturingContext';
import VoiceCommand from '../components/VoiceCommand';

// Dummy data for the 'Finished Product' dropdown - Fixed accessibility issue
const stockLedger = [
  { id: 1, name: 'Assembled Gaming PC' },
  { id: 2, name: 'Wooden Bookshelf' },
  { id: 3, name: 'Metal Desk Frame' },
];

// Helper function to generate a new, sequential BOM ID
function generateBOMId(lastId) {
  const nextNumber = (parseInt(lastId?.split('-')[1] || '0', 10) + 1);
  return `BOM-${nextNumber.toString().padStart(6, '0')}`;
}

const BillOfMaterials = () => {
  const { 
    billsOfMaterials, 
    addBOM, 
    updateBOM, 
    deleteBOM, 
    generateBOMId 
  } = useManufacturing();
  
  // State for the list view and view toggling
  const [search, setSearch] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editingBOM, setEditingBOM] = useState(null);

  // State for the Manufacturing Order display
  const [selectedBOMId, setSelectedBOMId] = useState('');
  const [moComponents, setMoComponents] = useState([]);
  const [moWorkOrders, setMoWorkOrders] = useState([]);

  // State for the form fields when creating or editing a BOM
  const isNew = !editingBOM;
  const [bomId, setBomId] = useState('');
  const [finishedProduct, setFinishedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reference, setReference] = useState('');
  const [components, setComponents] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);

  // New: for better interactivity
  const [error, setError] = useState('');
  const [rowHighlight, setRowHighlight] = useState(null);
  const finishedProductRef = useRef(null);

  // Focus on first field when entering edit/new
  useEffect(() => {
    if (showEdit && finishedProductRef.current) {
      finishedProductRef.current.focus();
    }
  }, [showEdit]);

  // Populate the form when switching to 'New/Edit' view
  useEffect(() => {
    if (showEdit) {
      if (editingBOM) { // Populate with data of the BOM being edited
        setBomId(editingBOM.id);
        setFinishedProduct(editingBOM.finishedProduct);
        setQuantity(editingBOM.quantity);
        setReference(editingBOM.reference);
        setComponents(editingBOM.components || []);
        setWorkOrders(editingBOM.workOrders || []);
      } else { // Reset fields for a new BOM
        setBomId(generateBOMId());
        setFinishedProduct('');
        setQuantity(1);
        setReference('');
        setComponents([]);
        setWorkOrders([]);
      }
      setError('');
    }
  }, [showEdit, editingBOM, generateBOMId]);

  // Update the Manufacturing Order display when a BOM is selected
  useEffect(() => {
    const bom = billsOfMaterials.find(b => b.id === selectedBOMId);
    if (bom) {
      setMoComponents(bom.components || []);
      setMoWorkOrders(bom.workOrders || []);
    } else {
      setMoComponents([]);
      setMoWorkOrders([]);
    }
  }, [selectedBOMId, billsOfMaterials]);

  // Dynamically filters the BOM list based on the search input
  const filteredBOMs = billsOfMaterials.filter(bom =>
    bom.finishedProduct.toLowerCase().includes(search.toLowerCase()) ||
    bom.reference.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers for the dynamic "Components" table in the form
  const addComponent = () => setComponents([...components, { component: '', toConsume: 1, units: '' }]);
  const updateComponent = (idx, field, value) => {
    const updated = components.map((row, i) => i === idx ? { ...row, [field]: value } : row);
    setComponents(updated);
  };
  const removeComponent = idx => setComponents(components.filter((_, i) => i !== idx));

  // Handlers for the dynamic "Work Orders" table in the form
  const addWorkOrder = () => setWorkOrders([...workOrders, { operation: '', workCenter: '', duration: '' }]);
  const updateWorkOrder = (idx, field, value) => {
    const updated = workOrders.map((row, i) => i === idx ? { ...row, [field]: value } : row);
    setWorkOrders(updated);
  };
  const removeWorkOrder = idx => setWorkOrders(workOrders.filter((_, i) => i !== idx));

  // Validate form fields before save
  const isFormInvalid = !finishedProduct || !quantity || quantity <= 0;

  // Save with confirmation and error feedback
  const handleSave = () => {
    setError('');
    if (isFormInvalid) {
      setError('Please select a Finished Product and set a valid Quantity.');
      return;
    }
    const bomToSave = { 
      id: bomId, 
      finishedProduct, 
      quantity: parseFloat(quantity), 
      reference, 
      components, 
      workOrders 
    };
    
    if (!isNew) {
      if (!window.confirm('Are you sure you want to overwrite this BOM?')) return;
      updateBOM(bomToSave.id, bomToSave);
    } else {
      addBOM(bomToSave);
    }
    setShowEdit(false);
    setEditingBOM(null);
  };

  // Confirm before canceling edits
  const handleCancel = () => {
    if (window.confirm('Discard changes to the Bill of Materials?')) {
      setShowEdit(false);
      setEditingBOM(null);
      setError('');
    }
  };

  // Handle row hover and click-to-edit
  const handleRowMouseEnter = idx => setRowHighlight(idx);
  const handleRowMouseLeave = () => setRowHighlight(null);

  const handleEdit = (bom) => { setEditingBOM(bom); setShowEdit(true); };
  const handleNew = () => { setEditingBOM(null); setShowEdit(true); };

  // Handle BOM deletion
  const handleDelete = (bomId) => {
    if (window.confirm('Are you sure you want to delete this BOM? This action cannot be undone.')) {
      deleteBOM(bomId);
    }
  };

  const handleVoiceCommand = (type, data) => {
    if (type === 'search') {
      setSearch(data);
    }
  };

  return (
    <div className="space-y-6">
      
      {!showEdit ? (
        <>          
          {/* Header with Search Bar */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bills of Materials</h1>
              <p className="text-gray-600 mt-1">Manage product bills of materials and manufacturing orders</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Finished Product or Reference..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input-field pl-10 w-80"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button onClick={handleNew} className="btn-primary">
                New BOM
              </button>
              <VoiceCommand onCommand={handleVoiceCommand} />
            </div>
          </div>

          {/* Bills of Materials Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BOM ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finished Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBOMs.length > 0 ? filteredBOMs.map((bom, idx) => (
                    <tr
                      key={bom.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        rowHighlight === idx ? 'bg-blue-50' : ''
                      }`}
                      onMouseEnter={() => handleRowMouseEnter(idx)}
                      onMouseLeave={handleRowMouseLeave}
                      onClick={() => handleEdit(bom)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bom.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bom.finishedProduct}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bom.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bom.reference}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={e => { e.stopPropagation(); handleEdit(bom); }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No Bills of Materials found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Manufacturing Order Display */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Manufacturing Order</h2>
                <p className="text-gray-600 mt-1">View components and work orders for selected BOM</p>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="bom-select" className="text-sm font-medium text-gray-700">Select BOM:</label>
                <select 
                  id="bom-select" 
                  value={selectedBOMId} 
                  onChange={e => setSelectedBOMId(e.target.value)}
                  className="input-field min-w-[250px]"
                >
                  <option value="">Select a BOM to view its template</option>
                  {billsOfMaterials.map(bom => (
                    <option key={bom.id} value={bom.id}>
                      {`${bom.id} - ${bom.finishedProduct}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Components Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Components</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Consume</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {moComponents.length > 0 ? moComponents.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.component}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.toConsume}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.units}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            Select a BOM to see components.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Work Orders Section */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Work Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Center</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Duration</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {moWorkOrders.length > 0 ? moWorkOrders.map((wo, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{wo.operation}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.workCenter}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{wo.duration}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                            Select a BOM to see work orders.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* New/Edit Bill of Materials Form View */
        <>
          {/* Form Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNew ? 'Create' : 'Edit'} Bill of Materials
              </h1>
              <p className="text-gray-600 mt-1">
                {isNew ? 'Create a new bill of materials' : 'Edit existing bill of materials'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowEdit(false)} 
                className="btn-secondary"
              >
                ← Back to List
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div className="card">
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">BOM ID</label>
                  <input 
                    value={bomId} 
                    readOnly 
                    className="input-field bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finished Product</label>
                  <select 
                    ref={finishedProductRef}
                    value={finishedProduct} 
                    onChange={e => setFinishedProduct(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select a Product</option>
                    {stockLedger.map(item => (
                      <option key={item.id} value={item.name}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference</label>
                  <input 
                    type="text" 
                    maxLength={8} 
                    value={reference} 
                    onChange={e => setReference(e.target.value)}
                    className="input-field"
                    placeholder="Optional reference"
                  />
                </div>
              </div>
            </div>

            {/* Components Table */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Components</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Consume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {components.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            value={row.component} 
                            onChange={e => updateComponent(idx, 'component', e.target.value)} 
                            placeholder="e.g., Motherboard"
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            value={row.toConsume} 
                            onChange={e => updateComponent(idx, 'toConsume', e.target.value)}
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            value={row.units} 
                            onChange={e => updateComponent(idx, 'units', e.target.value)} 
                            placeholder="e.g., pcs"
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => removeComponent(idx)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button onClick={addComponent} className="btn-secondary">
                  Add Component
                </button>
              </div>
            </div>

            {/* Work Orders Table */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Work Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Center</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Duration (hours)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workOrders.map((row, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            value={row.operation} 
                            onChange={e => updateWorkOrder(idx, 'operation', e.target.value)} 
                            placeholder="e.g., Assembly"
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            value={row.workCenter} 
                            onChange={e => updateWorkOrder(idx, 'workCenter', e.target.value)} 
                            placeholder="e.g., Assembly Line 1"
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0" 
                            value={row.duration} 
                            onChange={e => updateWorkOrder(idx, 'duration', e.target.value)}
                            className="input-field"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => removeWorkOrder(idx)} 
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <button onClick={addWorkOrder} className="btn-secondary">
                  Add Work Order
                </button>
              </div>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="btn-primary" 
                disabled={isFormInvalid}
              >
                Save Bill of Materials
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BillOfMaterials;
