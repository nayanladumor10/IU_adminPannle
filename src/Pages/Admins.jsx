import React, { useState, useEffect } from 'react';
import { FaUserShield, FaEdit, FaTrash, FaPlus, FaSearch, FaLock, FaUnlock, FaUserCog, FaMoneyBillWave, FaHeadset } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';

// Mock data for admin users
const mockAdmins = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2023-06-15 14:30:22',
    permissions: {
      users: { read: true, write: true, delete: true },
      vehicles: { read: true, write: true, delete: true },
      bookings: { read: true, write: true, delete: true },
      payments: { read: true, write: true, delete: true },
      settings: { read: true, write: true, delete: true }
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'finance',
    status: 'active',
    lastLogin: '2023-06-14 09:15:10',
    permissions: {
      users: { read: true, write: false, delete: false },
      vehicles: { read: true, write: false, delete: false },
      bookings: { read: true, write: false, delete: false },
      payments: { read: true, write: true, delete: false },
      settings: { read: false, write: false, delete: false }
    }
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'support',
    status: 'inactive',
    lastLogin: '2023-06-10 16:45:33',
    permissions: {
      users: { read: true, write: true, delete: false },
      vehicles: { read: true, write: true, delete: false },
      bookings: { read: true, write: true, delete: false },
      payments: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false }
    }
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'support',
    status: 'active',
    lastLogin: '2023-06-15 10:20:45',
    permissions: {
      users: { read: true, write: true, delete: false },
      vehicles: { read: true, write: true, delete: false },
      bookings: { read: true, write: true, delete: false },
      payments: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false }
    }
  }
];

// Role definitions
const roles = [
  { value: 'super_admin', label: 'Super Admin', icon: <MdSupervisorAccount className="text-purple-500" /> },
  { value: 'finance', label: 'Finance', icon: <FaMoneyBillWave className="text-green-500" /> },
  { value: 'support', label: 'Support', icon: <FaHeadset className="text-blue-500" /> }
];

// Permission categories
const permissionCategories = [
  { name: 'users', label: 'User Management' },
  { name: 'vehicles', label: 'Vehicle Management' },
  { name: 'bookings', label: 'Booking Management' },
  { name: 'payments', label: 'Payment Management' },
  { name: 'settings', label: 'System Settings' }
];

export default function Admins() {
  const [admins, setAdmins] = useState(mockAdmins);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'support',
    status: 'active',
    permissions: {
      users: { read: false, write: false, delete: false },
      vehicles: { read: false, write: false, delete: false },
      bookings: { read: false, write: false, delete: false },
      payments: { read: false, write: false, delete: false },
      settings: { read: false, write: false, delete: false }
    }
  });

  // Filter admins based on search, role, and status
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    const matchesStatus = filterStatus === 'all' || admin.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle permission changes
  const handlePermissionChange = (category, permission, value) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: value
        }
      }
    }));
  };

  // Add new admin
  const handleAddAdmin = () => {
    const newAdmin = {
      id: admins.length + 1,
      ...formData,
      lastLogin: new Date().toISOString()
    };
    setAdmins([...admins, newAdmin]);
    setShowAddModal(false);
    resetForm();
  };

  // Edit admin
  const handleEditAdmin = () => {
    setAdmins(admins.map(admin => 
      admin.id === currentAdmin.id ? { ...admin, ...formData } : admin
    ));
    setShowEditModal(false);
    resetForm();
  };

  // Delete admin
  const handleDeleteAdmin = (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      setAdmins(admins.filter(admin => admin.id !== id));
    }
  };

  // Toggle admin status
  const toggleAdminStatus = (id) => {
    setAdmins(admins.map(admin => 
      admin.id === id ? { ...admin, status: admin.status === 'active' ? 'inactive' : 'active' } : admin
    ));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'support',
      status: 'active',
      permissions: {
        users: { read: false, write: false, delete: false },
        vehicles: { read: false, write: false, delete: false },
        bookings: { read: false, write: false, delete: false },
        payments: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false }
      }
    });
  };

  // Load admin data for editing
  const loadAdminForEdit = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      permissions: JSON.parse(JSON.stringify(admin.permissions))
    });
    setShowEditModal(true);
  };

  // Set default permissions based on role
  useEffect(() => {
    if (formData.role === 'super_admin') {
      setFormData(prev => ({
        ...prev,
        permissions: {
          users: { read: true, write: true, delete: true },
          vehicles: { read: true, write: true, delete: true },
          bookings: { read: true, write: true, delete: true },
          payments: { read: true, write: true, delete: true },
          settings: { read: true, write: true, delete: true }
        }
      }));
    } else if (formData.role === 'finance') {
      setFormData(prev => ({
        ...prev,
        permissions: {
          users: { read: true, write: false, delete: false },
          vehicles: { read: true, write: false, delete: false },
          bookings: { read: true, write: false, delete: false },
          payments: { read: true, write: true, delete: false },
          settings: { read: false, write: false, delete: false }
        }
      }));
    } else if (formData.role === 'support') {
      setFormData(prev => ({
        ...prev,
        permissions: {
          users: { read: true, write: true, delete: false },
          vehicles: { read: true, write: true, delete: false },
          bookings: { read: true, write: true, delete: false },
          payments: { read: false, write: false, delete: false },
          settings: { read: false, write: false, delete: false }
        }
      }));
    }
  }, [formData.role]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaUserShield className="text-blue-500" />
            Admin Management
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search admins..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              <FaPlus /> Add Admin
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Role</label>
            <select
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter by Status</label>
            <select
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-800 dark:text-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Admins Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Permissions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAdmins.length > 0 ? (
                  filteredAdmins.map(admin => (
                    <tr key={admin.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <FaUserCog className="text-blue-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{admin.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {roles.find(r => r.value === admin.role)?.icon}
                          <span className="text-sm text-gray-900 dark:text-white">
                            {roles.find(r => r.value === admin.role)?.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {Object.keys(admin.permissions).filter(
                            cat => Object.values(admin.permissions[cat]).some(v => v)
                          ).length} categories
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          admin.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {admin.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(admin.lastLogin).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => toggleAdminStatus(admin.id)}
                            className={`p-2 rounded-full ${admin.status === 'active' ? 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20' : 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20'}`}
                            title={admin.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {admin.status === 'active' ? <FaLock /> : <FaUnlock />}
                          </button>
                          <button
                            onClick={() => loadAdminForEdit(admin)}
                            className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No admins found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Admin Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaPlus /> Add New Admin
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Permissions</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissionCategories.map(category => (
                      <div key={category.name} className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-600">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-2">{category.label}</h5>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].read}
                              onChange={(e) => handlePermissionChange(category.name, 'read', e.target.checked)}
                              className="rounded text-blue-500"
                            />
                            Read Access
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].write}
                              onChange={(e) => handlePermissionChange(category.name, 'write', e.target.checked)}
                              className="rounded text-blue-500"
                              disabled={!formData.permissions[category.name].read}
                            />
                            Write Access
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].delete}
                              onChange={(e) => handlePermissionChange(category.name, 'delete', e.target.checked)}
                              className="rounded text-blue-500"
                              disabled={!formData.permissions[category.name].write}
                            />
                            Delete Access
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAdmin}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Add Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Admin Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <FaEdit /> Edit Admin: {currentAdmin?.name}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      name="role"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-white"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <h4 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Permissions</h4>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissionCategories.map(category => (
                      <div key={category.name} className="border rounded-lg p-3 bg-white dark:bg-gray-800 dark:border-gray-600">
                        <h5 className="font-medium text-gray-800 dark:text-white mb-2">{category.label}</h5>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].read}
                              onChange={(e) => handlePermissionChange(category.name, 'read', e.target.checked)}
                              className="rounded text-blue-500"
                            />
                            Read Access
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].write}
                              onChange={(e) => handlePermissionChange(category.name, 'write', e.target.checked)}
                              className="rounded text-blue-500"
                              disabled={!formData.permissions[category.name].read}
                            />
                            Write Access
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={formData.permissions[category.name].delete}
                              onChange={(e) => handlePermissionChange(category.name, 'delete', e.target.checked)}
                              className="rounded text-blue-500"
                              disabled={!formData.permissions[category.name].write}
                            />
                            Delete Access
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditAdmin}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Update Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}