import { Link, useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { 
      title: 'Men', 
      image: '/placeholder.jpg',
      path: '/men',
      bg: 'bg-blue-500'
    },
    { 
      title: 'Women', 
      image: '/placeholder.jpg', 
      path: '/women',
      bg: 'bg-pink-500'
    },
    { 
      title: 'Kids', 
      image: '/placeholder.jpg', 
      path: '/kids',
      bg: 'bg-green-500'
    },
    { 
      title: 'Accessories', 
      image: '/placeholder.jpg', 
      path: '/accessories',
      bg: 'bg-purple-500'
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="group relative cursor-pointer hover:scale-105 transition-all duration-300 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl"
              onClick={() => navigate(category.path)}
            >
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                <img 
                  src={category.image} 
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80"
                />
                <div className={`absolute inset-0 ${category.bg} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`} />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-xl font-bold text-white drop-shadow-lg group-hover:scale-110 transition-transform">
                  {category.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;

