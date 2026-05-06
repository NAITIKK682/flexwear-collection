import HeroSection from './HeroSection';
import Categories from './Categories';
import FeaturedProducts from './FeaturedProducts';
import Newsletter from './Newsletter';

const Home = () => {
  return (
    <main className="flex flex-col">

      {/* ── 1. Hero ─────────────────────────────────────────── */}
      <HeroSection />

      {/* ── 2. Categories — dark contrast break ─────────────── */}
      <Categories />

      {/* ── 3. Featured Products — white section ─────────────── */}
      <FeaturedProducts />

      {/* ── 4. Newsletter — deep dark close ──────────────────── */}
      <Newsletter />

    </main>
  );
};

export default Home;