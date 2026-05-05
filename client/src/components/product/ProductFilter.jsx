import { useState, useEffect } from 'react';

const ProductFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    sortBy: 'newest'
  });

  // Price slider
  const [priceValue, setPriceValue] = useState([0, 10000]);

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = ['black', 'white', 'blue', 'red', 'green'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating' }
  ];

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = { priceRange: [0, 10000], sizes: [], colors: [], sortBy: 'newest' };
    setFilters(resetFilters);
    setPriceValue([0, 10000]);
    onFilterChange(resetFilters);
  };

  return (
    <div className="lg:w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24">
      {/* Price Range */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Price Range</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹{priceValue[0].toLocaleString()}</span>
            <span>₹{priceValue[1].toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            value={priceValue}
            onChange={(e) => {
              setPriceValue(e.target.value);
              handleFilterChange({ ...filters, priceRange: e.target.value });
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            multiple
          />
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Sizes</h3>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center space-x-2 p-2 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={filters.sizes.includes(size)}
                onChange={(e) => {
                  const newSizes = e.target.checked
                    ? [...filters.sizes, size]
                    : filters.sizes.filter(s => s !== size);
                  handleFilterChange({ ...filters, sizes: newSizes });
                }}
                className="rounded w-4 h-4 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <label key={color} className="cursor-pointer">
              <input
                type="checkbox"
                checked={filters.colors.includes(color)}
                onChange={(e) => {
                  const newColors = e.target.checked
                    ? [...filters.colors, color]
                    : filters.colors.filter(c => c !== color);
                  handleFilterChange({ ...filters, colors: newColors });
                }}
                className="sr-only"
              />
              <div className={`w-10 h-10 rounded-full border-4 border-white shadow-md cursor-pointer transition-all ${
                filters.colors.includes(color) ? 'ring-4 ring-primary/50 scale-110' : 'hover:scale-105'
              }`} style={{ backgroundColor: color }}></div>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Sort By</h3>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          onClick={clearFilters}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all"
        >
          Clear Filters
        </button>
        <button
          className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded-xl transition-all"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
