import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || '',
    department: 'Manufacturing',
    phone: '+1 (555) 123-4567',
    location: 'Factory Floor A'
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      department: 'Manufacturing',
      phone: '+1 (555) 123-4567',
      location: 'Factory Floor A'
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">My Profile</h1>
          <p className="text-secondary-600 mt-1">Manage your personal information and preferences</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <h2 className="text-xl font-semibold text-secondary-900 mb-1">
                {profileData.name}
              </h2>
              <p className="text-secondary-600 mb-4">{profileData.role}</p>
              <div className="space-y-2 text-sm text-secondary-600">
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {profileData.location}
                </div>
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {profileData.department}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Role
                </label>
                {isEditing ? (
                  <select
                    value={profileData.role}
                    onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                    className="input-field"
                  >
                    <option value="Production Manager">Production Manager</option>
                    <option value="Floor Supervisor">Floor Supervisor</option>
                    <option value="Quality Inspector">Quality Inspector</option>
                    <option value="Machine Operator">Machine Operator</option>
                    <option value="Maintenance Technician">Maintenance Technician</option>
                  </select>
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.role}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <select
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                    className="input-field"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.department}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Work Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    className="input-field"
                  />
                ) : (
                  <p className="text-secondary-900 py-2">{profileData.location}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-lg font-semibold text-secondary-900 mb-6">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Default View
            </label>
            <select className="input-field" disabled>
              <option>List View</option>
              <option>Kanban View</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-secondary-700">Email notifications</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="ml-2 text-sm text-secondary-700">Push notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
