import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] overflow-hidden bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* TEXT SECTION */}
          <div className="w-full lg:w-5/12 text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-5 tracking-tight text-slate-900">
              NEW COLLECTION
              <span className="block text-blue-600">2026</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-md text-slate-600 font-medium leading-relaxed">
              Discover the latest trendy fashion collections designed for everyone
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/men"
                className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-slate-800 transition-all shadow-lg"
              >
                Shop Now
              </Link>

              <Link
                to="/women"
                className="inline-flex items-center justify-center border-2 border-black text-black px-6 py-3 rounded-full text-sm sm:text-base font-bold hover:bg-black hover:text-white transition-all"
              >
                View Women
              </Link>
            </div>
          </div>

          {/* IMAGE SECTION (MAIN FIX) */}
          <div className="w-full lg:w-7/12 flex justify-center lg:justify-end">
            <div className="w-full flex justify-center">
              <img
                src="/images/hero.png"
                alt="New Collection 2026"
                className="w-[90%] sm:w-[85%] md:w-[80%] lg:w-full h-auto object-contain"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;