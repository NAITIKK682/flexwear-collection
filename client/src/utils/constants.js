export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = ['men', 'women', 'kids', 'accessories'];
export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
export const COLORS = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray'];

export const ORDER_STATUS = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export const PAYMENT_STATUS = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed'
};

