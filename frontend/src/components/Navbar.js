import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMasterMenu, setShowMasterMenu] = useState(false);
  const userMenuRef = useRef(null);
  const masterMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (masterMenuRef.current && !masterMenuRef.current.contains(event.target)) {
        setShowMasterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-secondary-200/60 sticky top-0 z-30">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Master Menu and Logo */}
          <div className="flex items-center space-x-4">
            {/* Master Menu Button */}
            <div className="relative" ref={masterMenuRef}>
              <button
                onClick={() => setShowMasterMenu(!showMasterMenu)}
                className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
                aria-label="Master Menu"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Master Menu Dropdown */}
              {showMasterMenu && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-strong border border-secondary-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-secondary-100">
                    <p className="text-sm font-medium text-secondary-900">Master Menu</p>
                  </div>
                  <div className="px-2 py-1">
                    <button 
                      onClick={() => { navigate('/app/manufacturing-orders'); setShowMasterMenu(false); }}
                      className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Manufacturing Orders
                    </button>
                    <button 
                      onClick={() => { navigate('/app/work-orders'); setShowMasterMenu(false); }}
                      className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Work Orders
                    </button>
                    <button 
                      onClick={() => { navigate('/app/bills-of-materials'); setShowMasterMenu(false); }}
                      className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Bills of Materials
                    </button>
                    <button 
                      onClick={() => { navigate('/app/work-center'); setShowMasterMenu(false); }}
                      className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Work Center
                    </button>
                    <button 
                      onClick={() => { navigate('/app/stock-ledger'); setShowMasterMenu(false); }}
                      className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Stock Ledger
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-secondary-900">
                  Manufacturing Management
                </h1>
                <p className="text-xs text-secondary-500">Voice-Enabled Production Control</p>
              </div>
            </div>
          </div>
          
          {/* Right side - User Menu */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* User Avatar and Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
                >
                  {/* Desktop User Info */}
                  <div className="hidden md:block text-right">
                    <div className="text-sm font-medium text-secondary-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-secondary-500">
                      {user.role}
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-strong border border-secondary-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-secondary-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                          <p className="text-xs text-secondary-500">{user.email || 'No email'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-2 py-1">
                      <div className="px-2 py-1 mb-1">
                        <p className="text-xs font-medium text-secondary-500 uppercase tracking-wide">Profile Setup</p>
                      </div>
                      <button 
                        onClick={() => { navigate('/app/profile'); setShowUserMenu(false); }}
                        className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </button>
                      <button 
                        onClick={() => { navigate('/app/work-orders'); setShowUserMenu(false); }}
                        className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        My Reports
                      </button>
                      <div className="border-t border-secondary-100 my-1"></div>
                      <button 
                        onClick={() => { navigate('/app/settings'); setShowUserMenu(false); }}
                        className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-2 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
