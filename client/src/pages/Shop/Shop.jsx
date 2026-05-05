import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';
import ProductFilter from '../../components/product/ProductFilter';
import ProductGrid from '../../components/product/ProductGrid';
import toast from 'react-hot-toast';

const Shop = ({ category: propCategory }) => {
  const { category: paramCategory } = useParams();
  const category = propCategory || paramCategory;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    sizes: [],
    colors: [],
    sortBy: 'newest'
  });

  const fetchProducts = useCallback(async (filterOverrides = {}) => {
    try {
      setLoading(true);
      const params = {
        category,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        sizes: filters.sizes.join(','),
        colors: filters.colors.join(','),
        sort: filters.sortBy === 'newest' ? '-createdAt' : 
              filters.sortBy === 'price-asc' ? 'discountedPrice' :
              filters.sortBy === 'price-desc' ? '-discountedPrice' : '-rating',
        limit: 20,
        ...filterOverrides
      };
      
      const response = await productService.getAllProducts(params);
      setProducts(response.data?.data || response.data?.products || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, filters]);

  useEffect(() => {
    if (category) {
      fetchProducts();
    }
  }, [fetchProducts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products';

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            </li>
            <li>
              <span className="px-2">/</span>
            </li>
            <li className="font-medium text-gray-900 capitalize">{categoryName}</li>
          </ol>
        </nav>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900 capitalize">{categoryName}</h1>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <ProductFilter onFilterChange={handleFilterChange} filters={filters} />
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid products={products} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
