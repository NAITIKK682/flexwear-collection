/**
 * Utility functions for formatting data
 */

// Format price to Indian Rupees format: ₹X,XXX
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to "DD MMM YYYY"
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

// Truncate text with "..."
export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
};

// Calculate discount percentage
export const calculateDiscount = (price, discountedPrice) => {
  if (!price || !discountedPrice) return 0;
  return Math.round(((price - discountedPrice) / price) * 100);
};

// Get Tailwind color class for order status
export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    shipped: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-purple-100 text-purple-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

