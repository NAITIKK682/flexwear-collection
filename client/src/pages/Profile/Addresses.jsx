import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';
import addressService from '../../services/addressService';
import toast from 'react-hot-toast';

const Addresses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    pin: '',
    isDefault: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsFetching(true);
    try {
      const response = await addressService.getAddresses();
      setAddresses(response.data.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        navigate('/auth');
        return;
      }
      toast.error('Failed to fetch addresses');
      setAddresses([]);
    } finally {
      setIsFetching(false);
    }
  };

  const openModal = (address = null) => {
    if (address) {
      setFormData(address);
      setEditingId(address._id);
    } else {
      setFormData({ label: '', street: '', city: '', state: '', pin: '', isDefault: false });
      setEditingId(null);
    }
    setIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData);
        toast.success('Address updated successfully');
      } else {
        await addressService.addAddress(formData);
        toast.success('Address added successfully');
      }
      setIsOpen(false);
      fetchAddresses();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        navigate('/auth');
        return;
      }
      toast.error(editingId ? 'Failed to update address' : 'Failed to add address');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    setDeleteLoading(prev => ({ ...prev, [id]: true }));
    try {
      await addressService.deleteAddress(id);
      toast.success('Address deleted successfully');
      fetchAddresses();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        navigate('/auth');
        return;
      }
      toast.error('Failed to delete address');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSetDefault = async (id) => {
    setDeleteLoading(prev => ({ ...prev, [id]: 'default' }));
    try {
      await addressService.setDefaultAddress(id);
      toast.success('Default address updated');
      fetchAddresses();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Session expired. Redirecting to login...');
        navigate('/auth');
        return;
      }
      toast.error('Failed to set default address');
    } finally {
      setDeleteLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <div className="border-b border-slate-200 pb-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">My Addresses</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
          >
            + Add New Address
          </button>
        </div>
        <p className="text-slate-600 mt-2">Manage your saved addresses for faster checkout.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isFetching ? (
          Array(4).fill().map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4 w-32"></div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
              <div className="h-10 bg-slate-200 rounded-lg w-48"></div>
            </div>
          ))
        ) : addresses.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl">
              📍
            </div>
            <h3 className="text-xl font-semibold mb-2 text-slate-900">No addresses saved</h3>
            <p className="mb-6">Add your first address to get started.</p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all"
            >
              Add Address
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{address.label}</h3>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Default
                  </span>
                )}
              </div>
              <div className="space-y-1 text-sm text-slate-600 mb-6">
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.pin}</p>
              </div>
              <div className="flex items-center space-x-2 pt-4 border-t border-slate-200">
                <button
                  onClick={() => openModal(address)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm p-2 -m-2 rounded-lg hover:bg-blue-50 transition-colors flex-1 text-left"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleSetDefault(address._id)}
                  disabled={address.isDefault || deleteLoading[address._id] === 'default'}
                  className={`font-medium text-sm p-2 -m-2 rounded-lg transition-colors flex-1 text-left ${
                    address.isDefault || deleteLoading[address._id] === 'default'
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {deleteLoading[address._id] === 'default' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 inline h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" pathLength="1" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                      </svg>
                      Setting...
                    </>
                  ) : (
                    'Set as Default'
                  )}
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  disabled={deleteLoading[address._id]}
                  className={`text-red-600 hover:text-red-700 font-medium text-sm p-2 -m-2 rounded-lg hover:bg-red-50 transition-colors ${
                    deleteLoading[address._id] ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  {deleteLoading[address._id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 inline h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" pathLength="1" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="border-b border-slate-200 px-6 py-6 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h3>
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Label</label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Home, Office, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="10001"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                  Set as default shipping address
                </label>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {formLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" pathLength="1" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                      </svg>
                      Saving...
                    </>
                  ) : editingId ? (
                    'Update Address'
                  ) : (
                    'Add Address'
                  )}
                </button>
              </div>
              
              {/** Disable form inputs during loading */}
              <input type="text" name="label" value={formData.label} onChange={handleInputChange} disabled={formLoading} className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="Home, Office, etc." required style={{display: 'none'}} />
              <input type="text" name="street" value={formData.street} onChange={handleInputChange} disabled={formLoading} className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="123 Main St" required style={{display: 'none'}} />
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} disabled={formLoading} className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`} required style={{display: 'none'}} />
              <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} disabled={formLoading} className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="10001" required style={{display: 'none'}} />
              <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} disabled={formLoading} className={`mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`} style={{display: 'none'}} />
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default Addresses;

