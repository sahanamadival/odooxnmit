import React, { createContext, useContext, useState, useCallback } from 'react';

const ManufacturingContext = createContext();

export const useManufacturing = () => {
  const context = useContext(ManufacturingContext);
  if (!context) {
    throw new Error('useManufacturing must be used within a ManufacturingProvider');
  }
  return context;
};

// Mock data with all possible statuses
const initialManufacturingOrders = [
  {
    id: 'MO-001',
    finishedProduct: 'Widget A',
    quantity: 100,
    scheduleDate: '2024-01-15',
    status: 'Draft',
    billOfMaterialId: 'BOM-001',
    priority: 'High',
    reference: 'REF-001',
    createdDate: '2024-01-10',
    estimatedDuration: 240,
    realDuration: 0,
    components: [
      { id: 1, component: 'Steel Frame', toConsume: 1, units: 'pcs', consumed: 0 },
      { id: 2, component: 'Motor', toConsume: 1, units: 'pcs', consumed: 0 },
      { id: 3, component: 'Screws', toConsume: 20, units: 'pcs', consumed: 0 }
    ],
    workOrders: [
      { id: 1, operation: 'Assembly', workCenter: 'Assembly Line 1', expectedDuration: 120, realDuration: 0, status: 'Pending' },
      { id: 2, operation: 'Quality Check', workCenter: 'QC Station', expectedDuration: 30, realDuration: 0, status: 'Pending' },
      { id: 3, operation: 'Packaging', workCenter: 'Packaging Line', expectedDuration: 90, realDuration: 0, status: 'Pending' }
    ]
  },
  {
    id: 'MO-002',
    finishedProduct: 'Widget B',
    quantity: 50,
    scheduleDate: '2024-01-20',
    status: 'Confirmed',
    billOfMaterialId: 'BOM-002',
    priority: 'Medium',
    reference: 'REF-002',
    createdDate: '2024-01-12',
    estimatedDuration: 180,
    realDuration: 0,
    components: [
      { id: 1, component: 'Aluminum Frame', toConsume: 1, units: 'pcs', consumed: 0 },
      { id: 2, component: 'Circuit Board', toConsume: 1, units: 'pcs', consumed: 0 }
    ],
    workOrders: [
      { id: 1, operation: 'Welding', workCenter: 'Welding Station', expectedDuration: 90, realDuration: 0, status: 'Pending' },
      { id: 2, operation: 'Testing', workCenter: 'Test Lab', expectedDuration: 90, realDuration: 0, status: 'Pending' }
    ]
  },
  {
    id: 'MO-003',
    finishedProduct: 'Widget C',
    quantity: 75,
    scheduleDate: '2024-01-18',
    status: 'In-Progress',
    billOfMaterialId: 'BOM-003',
    priority: 'High',
    reference: 'REF-003',
    createdDate: '2024-01-08',
    estimatedDuration: 300,
    realDuration: 150,
    components: [
      { id: 1, component: 'Plastic Housing', toConsume: 1, units: 'pcs', consumed: 1 },
      { id: 2, component: 'LED Strip', toConsume: 2, units: 'meters', consumed: 1 }
    ],
    workOrders: [
      { id: 1, operation: 'Molding', workCenter: 'Molding Station', expectedDuration: 180, realDuration: 150, status: 'In-Progress' },
      { id: 2, operation: 'Assembly', workCenter: 'Assembly Line 2', expectedDuration: 120, realDuration: 0, status: 'Pending' }
    ]
  },
  {
    id: 'MO-004',
    finishedProduct: 'Widget D',
    quantity: 200,
    scheduleDate: '2024-01-10',
    status: 'Done',
    billOfMaterialId: 'BOM-004',
    priority: 'Low',
    reference: 'REF-004',
    createdDate: '2024-01-05',
    estimatedDuration: 400,
    realDuration: 380,
    components: [
      { id: 1, component: 'Metal Casing', toConsume: 1, units: 'pcs', consumed: 1 },
      { id: 2, component: 'Rubber Gasket', toConsume: 2, units: 'pcs', consumed: 2 }
    ],
    workOrders: [
      { id: 1, operation: 'Cutting', workCenter: 'CNC Station', expectedDuration: 200, realDuration: 190, status: 'Done' },
      { id: 2, operation: 'Finishing', workCenter: 'Finishing Station', expectedDuration: 200, realDuration: 190, status: 'Done' }
    ]
  },
  {
    id: 'MO-005',
    finishedProduct: 'Widget E',
    quantity: 30,
    scheduleDate: '2024-01-25',
    status: 'Cancelled',
    billOfMaterialId: 'BOM-005',
    priority: 'Low',
    reference: 'REF-005',
    createdDate: '2024-01-15',
    estimatedDuration: 150,
    realDuration: 0,
    components: [
      { id: 1, component: 'Glass Panel', toConsume: 1, units: 'pcs', consumed: 0 }
    ],
    workOrders: [
      { id: 1, operation: 'Polishing', workCenter: 'Polishing Station', expectedDuration: 150, realDuration: 0, status: 'Cancelled' }
    ]
  }
];

const initialBillsOfMaterials = [
  {
    id: 'BOM-001',
    finishedProduct: 'Widget A',
    quantity: 1,
    reference: 'WA-001',
    components: [
      { component: 'Steel Frame', toConsume: 1, units: 'pcs' },
      { component: 'Motor', toConsume: 1, units: 'pcs' },
      { component: 'Screws', toConsume: 20, units: 'pcs' }
    ],
    workOrders: [
      { operation: 'Assembly', workCenter: 'Assembly Line 1', duration: '120' },
      { operation: 'Quality Check', workCenter: 'QC Station', duration: '30' },
      { operation: 'Packaging', workCenter: 'Packaging Line', duration: '90' }
    ]
  },
  {
    id: 'BOM-002',
    finishedProduct: 'Widget B',
    quantity: 1,
    reference: 'WB-001',
    components: [
      { component: 'Aluminum Frame', toConsume: 1, units: 'pcs' },
      { component: 'Circuit Board', toConsume: 1, units: 'pcs' }
    ],
    workOrders: [
      { operation: 'Welding', workCenter: 'Welding Station', duration: '90' },
      { operation: 'Testing', workCenter: 'Test Lab', duration: '90' }
    ]
  },
  {
    id: 'BOM-003',
    finishedProduct: 'Widget C',
    quantity: 1,
    reference: 'WC-001',
    components: [
      { component: 'Plastic Housing', toConsume: 1, units: 'pcs' },
      { component: 'LED Strip', toConsume: 2, units: 'meters' }
    ],
    workOrders: [
      { operation: 'Molding', workCenter: 'Molding Station', duration: '180' },
      { operation: 'Assembly', workCenter: 'Assembly Line 2', duration: '120' }
    ]
  },
  {
    id: 'BOM-004',
    finishedProduct: 'Widget D',
    quantity: 1,
    reference: 'WD-001',
    components: [
      { component: 'Metal Casing', toConsume: 1, units: 'pcs' },
      { component: 'Rubber Gasket', toConsume: 2, units: 'pcs' }
    ],
    workOrders: [
      { operation: 'Cutting', workCenter: 'CNC Station', duration: '200' },
      { operation: 'Finishing', workCenter: 'Finishing Station', duration: '200' }
    ]
  },
  {
    id: 'BOM-005',
    finishedProduct: 'Widget E',
    quantity: 1,
    reference: 'WE-001',
    components: [
      { component: 'Glass Panel', toConsume: 1, units: 'pcs' }
    ],
    workOrders: [
      { operation: 'Polishing', workCenter: 'Polishing Station', duration: '150' }
    ]
  }
];

const initialWorkOrders = [
  {
    id: 'WO-001',
    manufacturingOrderId: 'MO-001',
    operation: 'Assembly',
    workCenter: 'Assembly Line 1',
    expectedDuration: 120,
    realDuration: 0,
    status: 'Pending',
    product: 'Widget A',
    quantity: 100
  },
  {
    id: 'WO-002',
    manufacturingOrderId: 'MO-001',
    operation: 'Quality Check',
    workCenter: 'QC Station',
    expectedDuration: 30,
    realDuration: 0,
    status: 'Pending',
    product: 'Widget A',
    quantity: 100
  },
  {
    id: 'WO-003',
    manufacturingOrderId: 'MO-003',
    operation: 'Molding',
    workCenter: 'Molding Station',
    expectedDuration: 180,
    realDuration: 150,
    status: 'In-Progress',
    product: 'Widget C',
    quantity: 75
  },
  {
    id: 'WO-004',
    manufacturingOrderId: 'MO-004',
    operation: 'Cutting',
    workCenter: 'CNC Station',
    expectedDuration: 200,
    realDuration: 190,
    status: 'Done',
    product: 'Widget D',
    quantity: 200
  }
];

const initialStockItems = [
  {
    id: 'STK-001',
    product: 'Steel Frame',
    unitCost: 1200,
    unit: 'pcs',
    totalValue: 600000,
    onHand: 500,
    freeToUse: 270,
    incoming: 0,
    outgoing: 230
  },
  {
    id: 'STK-002',
    product: 'Motor',
    unitCost: 500,
    unit: 'pcs',
    totalValue: 25000,
    onHand: 50,
    freeToUse: 30,
    incoming: 20,
    outgoing: 0
  },
  {
    id: 'STK-003',
    product: 'Aluminum Frame',
    unitCost: 100,
    unit: 'pcs',
    totalValue: 2000,
    onHand: 20,
    freeToUse: 20,
    incoming: 0,
    outgoing: 0
  },
  {
    id: 'STK-004',
    product: 'Circuit Board',
    unitCost: 300,
    unit: 'pcs',
    totalValue: 15000,
    onHand: 50,
    freeToUse: 40,
    incoming: 10,
    outgoing: 0
  },
  {
    id: 'STK-005',
    product: 'Plastic Housing',
    unitCost: 150,
    unit: 'pcs',
    totalValue: 11250,
    onHand: 75,
    freeToUse: 50,
    incoming: 25,
    outgoing: 0
  }
];

export const ManufacturingProvider = ({ children }) => {
  const [manufacturingOrders, setManufacturingOrders] = useState(initialManufacturingOrders);
  const [billsOfMaterials, setBillsOfMaterials] = useState(initialBillsOfMaterials);
  const [workOrders, setWorkOrders] = useState(initialWorkOrders);
  const [stockItems, setStockItems] = useState(initialStockItems);

  // Generate new ID for orders
  const generateOrderId = useCallback(() => {
    const maxId = manufacturingOrders.reduce((max, order) => {
      const num = parseInt(order.id.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `MO-${String(maxId + 1).padStart(3, '0')}`;
  }, [manufacturingOrders]);

  // Generate new ID for BOMs
  const generateBOMId = useCallback(() => {
    const maxId = billsOfMaterials.reduce((max, bom) => {
      const num = parseInt(bom.id.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `BOM-${String(maxId + 1).padStart(3, '0')}`;
  }, [billsOfMaterials]);

  // Update order status
  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setManufacturingOrders(prev => 
      prev.map(order => {
        if (order.id === orderId) {
          const updatedOrder = { ...order, status: newStatus };
          
          // Update work orders status when manufacturing order status changes
          if (newStatus === 'In-Progress') {
            updatedOrder.workOrders = order.workOrders.map(wo => ({
              ...wo,
              status: wo.status === 'Pending' ? 'In-Progress' : wo.status
            }));
          } else if (newStatus === 'Done') {
            updatedOrder.workOrders = order.workOrders.map(wo => ({
              ...wo,
              status: 'Done'
            }));
          } else if (newStatus === 'Cancelled') {
            updatedOrder.workOrders = order.workOrders.map(wo => ({
              ...wo,
              status: 'Cancelled'
            }));
          }
          
          return updatedOrder;
        }
        return order;
      })
    );
  }, []);

  // Add new order
  const addOrder = useCallback((newOrderData) => {
    const newOrder = {
      id: generateOrderId(),
      ...newOrderData,
      status: 'Draft',
      createdDate: new Date().toISOString().split('T')[0],
      realDuration: 0
    };
    setManufacturingOrders(prev => [...prev, newOrder]);
    return newOrder.id;
  }, [generateOrderId]);

  // Update order
  const updateOrder = useCallback((orderId, updatedData) => {
    setManufacturingOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, ...updatedData } : order
      )
    );
  }, []);

  // Delete order
  const deleteOrder = useCallback((orderId) => {
    setManufacturingOrders(prev => prev.filter(order => order.id !== orderId));
  }, []);

  // Add new BOM
  const addBOM = useCallback((newBOMData) => {
    const newBOM = {
      id: generateBOMId(),
      ...newBOMData
    };
    setBillsOfMaterials(prev => [...prev, newBOM]);
    return newBOM.id;
  }, [generateBOMId]);

  // Update BOM
  const updateBOM = useCallback((bomId, updatedData) => {
    setBillsOfMaterials(prev =>
      prev.map(bom =>
        bom.id === bomId ? { ...bom, ...updatedData } : bom
      )
    );
  }, []);

  // Delete BOM
  const deleteBOM = useCallback((bomId) => {
    setBillsOfMaterials(prev => prev.filter(bom => bom.id !== bomId));
  }, []);

  // Get BOM by ID
  const getBOMById = useCallback((bomId) => {
    return billsOfMaterials.find(bom => bom.id === bomId);
  }, [billsOfMaterials]);

  // Get order by ID
  const getOrderById = useCallback((orderId) => {
    return manufacturingOrders.find(order => order.id === orderId);
  }, [manufacturingOrders]);

  // Update work order duration
  const updateWorkOrderDuration = useCallback((orderId, workOrderId, duration) => {
    setManufacturingOrders(prev =>
      prev.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            workOrders: order.workOrders.map(wo =>
              wo.id === workOrderId ? { ...wo, realDuration: duration } : wo
            )
          };
        }
        return order;
      })
    );
  }, []);

  // Generate new ID for stock items
  const generateStockId = useCallback(() => {
    const maxId = stockItems.reduce((max, item) => {
      const num = parseInt(item.id.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    return `STK-${String(maxId + 1).padStart(3, '0')}`;
  }, [stockItems]);

  // Add new stock item
  const addStockItem = useCallback((newStockData) => {
    const newStock = {
      id: generateStockId(),
      ...newStockData,
      totalValue: parseFloat(newStockData.unitCost || 0) * parseFloat(newStockData.onHand || 0)
    };
    setStockItems(prev => [...prev, newStock]);
    return newStock.id;
  }, [generateStockId]);

  // Update stock item
  const updateStockItem = useCallback((stockId, updatedData) => {
    setStockItems(prev =>
      prev.map(item => {
        if (item.id === stockId) {
          const updatedItem = { ...item, ...updatedData };
          // Recalculate total value
          updatedItem.totalValue = parseFloat(updatedItem.unitCost || 0) * parseFloat(updatedItem.onHand || 0);
          return updatedItem;
        }
        return item;
      })
    );
  }, []);

  // Delete stock item
  const deleteStockItem = useCallback((stockId) => {
    setStockItems(prev => prev.filter(item => item.id !== stockId));
  }, []);

  // Get stock item by ID
  const getStockItemById = useCallback((stockId) => {
    return stockItems.find(item => item.id === stockId);
  }, [stockItems]);

  const value = {
    // Data
    manufacturingOrders,
    billsOfMaterials,
    workOrders,
    stockItems,
    
    // Manufacturing Orders
    updateOrderStatus,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrderById,
    generateOrderId,
    
    // Bills of Materials
    addBOM,
    updateBOM,
    deleteBOM,
    getBOMById,
    generateBOMId,
    
    // Work Orders
    updateWorkOrderDuration,
    
    // Stock Items
    addStockItem,
    updateStockItem,
    deleteStockItem,
    getStockItemById,
    generateStockId
  };

  return (
    <ManufacturingContext.Provider value={value}>
      {children}
    </ManufacturingContext.Provider>
  );
};