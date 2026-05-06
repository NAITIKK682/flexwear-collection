import api from './api';

const getAddresses = async () => {
  return api.get('/addresses');
};

const addAddress = async (addressData) => {
  return api.post('/addresses', addressData);
};

const updateAddress = async (id, addressData) => {
  return api.put(`/addresses/${id}`, addressData);
};

const deleteAddress = async (id) => {
  return api.delete(`/addresses/${id}`);
};

const setDefaultAddress = async (id) => {
  return api.patch(`/addresses/${id}/default`);
};

// Exporting both as default and named to prevent import errors in Checkout.jsx
export const addressService = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};

export default addressService;