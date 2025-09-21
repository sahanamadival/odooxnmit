import React from 'react';

const OrderTable = ({ 
  data, 
  columns, 
  onRowClick, 
  onEdit, 
  onDelete, 
  onStart, 
  onComplete,
  onCancel,
  showActions = true,
  loading = false,
  emptyMessage = "No data available"
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'in progress':
        return 'badge-info';
      case 'pending':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-danger';
      case 'in time':
        return 'badge-success';
      case 'delayed':
        return 'badge-danger';
      case 'new':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '00:00';
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return duration;
  };

  const formatValue = (value, column) => {
    if (column.key === 'status') {
      return (
        <span className={`badge ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    }
    
    if (column.key === 'expectedDuration' || column.key === 'realDuration') {
      return (
        <span className="font-mono text-sm">
          {formatDuration(value)}
        </span>
      );
    }
    
    if (column.key === 'quantity' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    if (column.key === 'totalValue' && typeof value === 'number') {
      return `$${value.toLocaleString()}`;
    }
    
    return value;
  };

  if (loading) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <div className="loading-spinner h-8 w-8 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-container">
        <div className="p-8 text-center">
          <svg className="w-12 h-12 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-secondary-600 font-medium">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="table-header">
                  {column.header}
                </th>
              ))}
              {showActions && (
                <th className="table-header">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="table-row-interactive"
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="table-cell">
                    {formatValue(row[column.key], column)}
                  </td>
                ))}
                {showActions && (
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className="btn-ghost btn-sm"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {onStart && row.status?.toLowerCase() === 'pending' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStart(row);
                          }}
                          className="btn-success btn-sm"
                          title="Start"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                          </svg>
                        </button>
                      )}
                      {onComplete && row.status?.toLowerCase() === 'in progress' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onComplete(row);
                          }}
                          className="btn-success btn-sm"
                          title="Complete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      {onCancel && row.status?.toLowerCase() !== 'completed' && row.status?.toLowerCase() !== 'cancelled' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancel(row);
                          }}
                          className="btn-danger btn-sm"
                          title="Cancel"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(row);
                          }}
                          className="btn-danger btn-sm"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {data.map((row, rowIndex) => (
          <div 
            key={rowIndex}
            className="card-hover cursor-pointer"
            onClick={() => onRowClick && onRowClick(row)}
          >
            <div className="space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary-600">
                    {column.header}:
                  </span>
                  <span className="text-sm text-secondary-900">
                    {formatValue(row[column.key], column)}
                  </span>
                </div>
              ))}
              {showActions && (
                <div className="flex space-x-2 pt-3 border-t border-secondary-200">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(row);
                      }}
                      className="btn-ghost btn-sm flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  )}
                  {onStart && row.status?.toLowerCase() === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStart(row);
                      }}
                      className="btn-success btn-sm flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                      </svg>
                      Start
                    </button>
                  )}
                  {onComplete && row.status?.toLowerCase() === 'in progress' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(row);
                      }}
                      className="btn-success btn-sm flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete
                    </button>
                  )}
                  {onCancel && row.status?.toLowerCase() !== 'completed' && row.status?.toLowerCase() !== 'cancelled' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancel(row);
                      }}
                      className="btn-danger btn-sm flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(row);
                      }}
                      className="btn-danger btn-sm flex-1"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTable;
