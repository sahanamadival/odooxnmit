import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onMenuToggle, isMenuOpen }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-soft border-b border-secondary-200/60 sticky top-0 z-30">
      <div className="container-responsive">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
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
              {/* Desktop User Info */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
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
              </div>

              {/* Mobile User Info */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* User Menu Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 transition-colors duration-200"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-secondary-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-secondary-100">
                      <p className="text-sm font-medium text-secondary-900">{user.name}</p>
                      <p className="text-xs text-secondary-500">{user.email || 'No email'}</p>
                    </div>
                    <div className="px-2 py-1">
                      <button className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-2 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg transition-colors duration-200">
                        Preferences
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-2 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors duration-200"
                      >
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
