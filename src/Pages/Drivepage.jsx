import React, { useState } from 'react';
import {
  User, Shield, Users, MessageCircle, Plus, Search, Filter, Car
} from 'lucide-react';

export default function DriverManagementDashboard() {
  const [activeTab, setActiveTab] = useState('drivers');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "9876543210",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Bike",
    },
    {
      id: 2,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "8765432109",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Scooter",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "7654321098",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Auto Rickshaw",
    },
    {
      id: 4,
      name: "Neha Verma",
      email: "neha.verma@example.com",
      phone: "9543210987",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "Car",
    },
    {
      id: 5,
      name: "Sunil Joshi",
      email: "sunil.joshi@example.com",
      phone: "9123456780",
      kycStatus: "Pending",
      joinDate: "2025-06-05",
      vehicleType: "E-Rickshaw",
    }
  ]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [editDriver, setEditDriver] = useState(null);
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [insurancePhoto, setInsurancePhoto] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ type: '', plate: '' });
  const [vehicles, setVehicles] = useState([]);
  const [vehicleSuccessMessage, setVehicleSuccessMessage] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
    setFormData({ name: '', email: '', phone: '' });
    setErrors({});
    setSuccessMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setErrors({});
    setSuccessMessage('');
    setLicensePhoto(null);
    setInsurancePhoto(null);
    setPassportPhoto(null);
  };

  const newDriver = {
    id: drivers.length + 1,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    kycStatus: 'Pending',
    joinDate: new Date().toISOString().split('T')[0],
    vehicleType: '',     // <--- add this!
  };

  const handleDeleteDriver = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this driver?");
    if (confirmed) {
      const updatedDrivers = drivers.filter((driver) => driver.id !== id);
      setDrivers(updatedDrivers);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Driver name is required.';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Phone must be 10 digits.';
    if (!formData.email.includes('@') || !formData.email.includes('.')) newErrors.email = 'Invalid email format.';
    return newErrors;
  };

  const handleConfirm = () => {
    if (modalType === 'onboard') {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const newDriver = {
        id: drivers.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        kycStatus: 'Pending',
        joinDate: new Date().toISOString().split('T')[0],
      };

      setDrivers([...drivers, newDriver]);
      setSuccessMessage('Details added successfully!');
      setFormData({ name: '', email: '', phone: '' });
      setErrors({});

      setTimeout(() => {
        setSuccessMessage('');
        closeModal();
      }, 1500);
    }
    else if (modalType === 'kyc') {
      if (licensePhoto && insurancePhoto && passportPhoto) {
        setDrivers(prev =>
          prev.map(driver =>
            driver.kycStatus === 'Pending'
              ? { ...driver, kycStatus: 'Completed' }
              : driver
          )
        );
      }
      closeModal();
    }
    else if (modalType === 'manage' && editDriver) {
      setDrivers((prev) =>
        prev.map((driver) => (driver.id === editDriver.id ? editDriver : driver))
      );
      setEditDriver(null);
      closeModal();
    }
    else if (modalType === 'vehicleType') {
      if (!vehicleForm.type || !vehicleForm.plate || selectedDriverId === null) return;

      const updatedDrivers = drivers.map(driver => {
        if (driver.id === selectedDriverId) {
          return {
            ...driver,
            vehicleType: vehicleForm.type,
            licensePlate: vehicleForm.plate
          };
        }
        return driver;
      });

      setDrivers(updatedDrivers);
      setVehicleForm({ type: '', plate: '' });
      setSelectedDriverId(null);
      setShowModal(false);
      setVehicleSuccessMessage('Vehicle added successfully!');

      setTimeout(() => setVehicleSuccessMessage(''), 3000);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'verified':
      case 'completed':
      case 'resolved':
        return 'text-green-500 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'text-yellow-500 dark:text-yellow-400';
      case 'open':
      case 'in progress':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">Management Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Driver Management & Customer Support System</p>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-fit">
          <button 
            onClick={() => setActiveTab('drivers')} 
            className={`px-6 py-3 rounded-md font-medium ${activeTab === 'drivers' ? 'bg-green-600 dark:bg-green-700 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            <User className="inline w-4 h-4 mr-2" />
            Driver Management
          </button>
          <button 
            onClick={() => {
              setActiveTab('vehicle');
              setModalType('vehicleType');
            }} 
            className={`px-6 py-3 rounded-md font-medium ${activeTab === 'vehicle' ? 'bg-green-600 dark:bg-green-700 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Car className="inline w-4 h-4 mr-2" />
            Vehicle Information
          </button>
        </div>

        {/* Driver Management */}
        {activeTab === 'drivers' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 mb-6">
              <button 
                onClick={() => openModal('onboard')} 
                className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg flex items-center font-medium text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Onboard New Driver
              </button>
              <button
                onClick={() => openModal('kyc')}
                className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Verify KYC & Documents
              </button>
              <button
                onClick={() => openModal('manage')}
                className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg font-medium transition-colors flex items-center text-white"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Profiles
              </button>
            </div>

            {/* Driver Search & Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search drivers..."
                  className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                />
              </div>
              <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center text-gray-700 dark:text-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>

            {/* Drivers Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm dark:shadow-none">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">Driver List</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Name</th>
                      <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Contact</th>
                      <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">KYC</th>
                      <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Join Date</th>
                      <th className="px-6 py-4 text-left text-gray-600 dark:text-gray-400 font-medium">Vehicle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((driver) => (
                      <tr key={driver.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">{driver.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">ID: {driver.id}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                          <div>{driver.email}</div>
                          <div>{driver.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-medium ${getStatusColor(driver.kycStatus)}`}>{driver.kycStatus}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{driver.joinDate}</td>
                        <td
                          className="px-6 py-4 text-green-600 dark:text-green-400 cursor-pointer hover:underline"
                          onClick={() => {
                            setSelectedDriverId(driver.id);
                            setVehicleForm({ type: driver.vehicleType || '', plate: driver.licensePlate || '' });
                            setModalType('vehicleType');
                            setShowModal(true);
                          }}
                        >
                          {driver.vehicleType || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Vehicle Tab */}
        {activeTab === 'vehicle' && (
          <div className="space-y-6">
            {/* Vehicle Info Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (!selectedDriverId) {
                    alert("Please select a driver from the Driver tab to update vehicle info.");
                    return;
                  }
                  setModalType('vehicleType');
                }}
                className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg flex items-center font-medium text-white"
              >
                Vehicle Type
              </button>

              <button 
                onClick={() => setModalType('vehicleInstructions')} 
                className="bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-6 py-3 rounded-lg flex items-center font-medium text-white"
              >
                Vehicle Instructions
              </button>
            </div>

            {modalType === 'vehicleType' && (
              <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none">
                {activeTab === 'vehicle' && (
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Select Driver</label>
                    <select
                      value={selectedDriverId || ''}
                      onChange={(e) => setSelectedDriverId(Number(e.target.value))}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
                    >
                      <option value="">-- Select Driver --</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} (ID: {driver.id})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Vehicle Type (Car, Bike, etc.)</label>
                  <input
                    type="text"
                    value={vehicleForm.type}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., Car"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">License Plate Number</label>
                  <input
                    type="text"
                    value={vehicleForm.plate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, plate: e.target.value })}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="e.g., MH12AB1234"
                  />
                </div>

                <button
                  onClick={handleConfirm}
                  className="mt-4 bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 w-full py-2 rounded-lg text-white font-semibold transition"
                >
                  Submit Vehicle Type
                </button>
              </div>
            )}

            {modalType === 'vehicleInstructions' && (
              <ul className="text-gray-900 dark:text-white list-disc space-y-2 pl-5 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:shadow-none">
                <li>Always wear your seatbelt or helmet.</li>
                <li>Maintain proper tire pressure.</li>
                <li>Regularly service your vehicle.</li>
                <li>Keep vehicle documents in the glove box.</li>
                <li>Do not overload the vehicle.</li>
                <li>Follow speed limits and traffic rules.</li>
              </ul>
            )}
          </div>
        )}

        {/* Modal Section */}
        {showModal && modalType !== 'vehicleType' && modalType !== 'vehicleInstructions' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
                  {modalType === 'onboard' && 'Onboard New Driver'}
                  {modalType === 'kyc' && 'Verify KYC & Documents'}
                  {modalType === 'manage' && 'Manage Driver Profiles'}
                  {modalType === 'complaint' && 'Manage Customer Complaints'}
                  {modalType === 'refund' && 'Initiate Refund'}
                </h3>
                <button onClick={closeModal} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl">×</button>
              </div>

              {/* Body */}
              <div className="space-y-4">
                {/* Onboard New Driver */}
                {modalType === 'onboard' && (
                  <>
                    <input
                      type="text"
                      placeholder="Driver Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.name && <p className="text-red-500 dark:text-red-400 text-sm">{errors.name}</p>}

                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.email && <p className="text-red-500 dark:text-red-400 text-sm">{errors.email}</p>}

                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    {errors.phone && <p className="text-red-500 dark:text-red-400 text-sm">{errors.phone}</p>}
                  </>
                )}

                {/* KYC Upload */}
                {modalType === 'kyc' && (
                  <div className="space-y-4">
                    {/* Driver's License Photo */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upload Driver's License Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setLicensePhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Insurance Certificate */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upload Insurance Certificate</label>
                      <input
                        type="file"
                        onChange={(e) => setInsurancePhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Passport Size Photo */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">Upload Passport Size Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setPassportPhoto(e.target.files[0])}
                        className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                )}

                {modalType === 'manage' && (
                  <>
                    {editDriver ? (
                      <>
                        <input
                          type="text"
                          placeholder="Driver Name"
                          value={editDriver.name}
                          onChange={(e) => setEditDriver({ ...editDriver, name: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="email"
                          placeholder="Email Address"
                          value={editDriver.email}
                          onChange={(e) => setEditDriver({ ...editDriver, email: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          value={editDriver.phone}
                          onChange={(e) => setEditDriver({ ...editDriver, phone: e.target.value })}
                          className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                      </>
                    ) : (
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {drivers.map((driver) => (
                          <div key={driver.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                            <div>
                              <div className="text-gray-900 dark:text-white font-medium">{driver.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{driver.email} | {driver.phone}</div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditDriver(driver)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDriver(driver.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Success Message (Onboard only) */}
              {modalType === 'onboard' && successMessage && (
                <p className="text-green-600 dark:text-green-400 mt-4">{successMessage}</p>
              )}

              {/* Vehicle success message */}
              {vehicleSuccessMessage && (
                <div className="fixed top-4 right-4 bg-green-600 dark:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                  {vehicleSuccessMessage}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={closeModal} 
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-lg font-medium text-gray-800 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirm} 
                  className="flex-1 bg-green-600 dark:bg-green-700 hover:bg-green-500 dark:hover:bg-green-600 px-4 py-3 rounded-lg font-medium text-white"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}