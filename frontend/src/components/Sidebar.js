import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Manufacturing Orders', path: '/manufacturing-orders', icon: '🏭' },
    { name: 'Work Orders', path: '/work-orders', icon: '⚙️' },
    { name: 'Bills of Materials', path: '/bills-of-materials', icon: '📋' },
    { name: 'Work Center', path: '/work-center', icon: '🏢' },
    { name: 'Stock Ledger', path: '/stock-ledger', icon: '📦' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Master Menu</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`sidebar-item w-full text-left ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
