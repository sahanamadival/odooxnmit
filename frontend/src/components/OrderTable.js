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
  showActions = true 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in time':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="table-cell">
                  {column.key === 'status' ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row[column.key])}`}>
                      {row[column.key]}
                    </span>
                  ) : column.key === 'expectedDuration' || column.key === 'realDuration' ? (
                    formatDuration(row[column.key])
                  ) : (
                    row[column.key]
                  )}
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
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                    )}
                    {onStart && row.status?.toLowerCase() === 'pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStart(row);
                        }}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Start
                      </button>
                    )}
                    {onComplete && row.status?.toLowerCase() === 'in progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onComplete(row);
                        }}
                        className="text-green-600 hover:text-green-900 text-sm"
                      >
                        Complete
                      </button>
                    )}
                    {onCancel && row.status?.toLowerCase() !== 'completed' && row.status?.toLowerCase() !== 'cancelled' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCancel(row);
                        }}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Cancel
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
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
  );
};

export default OrderTable;
