import ProductGrid from "../../components/product/ProductGrid";

const Accessories = () => {
  const products = {
    watches: [
      { id: 1, name: "Classic Watch", price: 1999, image: "/images/accessories/watches/watch1.jpg" },
    ],
    bags: [
      { id: 2, name: "Backpack", price: 1499, image: "/images/accessories/bags/bag1.jpg" },
    ],
    sunglasses: [
      { id: 3, name: "Sunglasses", price: 999, image: "/images/accessories/sunglasses/sun1.jpg" },
    ],
    belts: [
      { id: 4, name: "Leather Belt", price: 799, image: "/images/accessories/belts/belt1.jpg" },
    ],
    jewelry: [
      { id: 5, name: "Chain", price: 599, image: "/images/accessories/jewelry/jewel1.jpg" },
    ],
    caps: [
      { id: 6, name: "Cap", price: 399, image: "/images/accessories/caps/cap1.jpg" },
    ],
    wallets: [
      { id: 7, name: "Wallet", price: 899, image: "/images/accessories/wallets/wallet1.jpg" },
    ],
  };

  return (
    <div className="p-6 space-y-10">

      <Section title="Watches" products={products.watches} />
      <Section title="Bags" products={products.bags} />
      <Section title="Sunglasses" products={products.sunglasses} />
      <Section title="Belts" products={products.belts} />
      <Section title="Jewelry" products={products.jewelry} />
      <Section title="Caps & Hats" products={products.caps} />
      <Section title="Wallets" products={products.wallets} />

    </div>
  );
};

// reusable section component
const Section = ({ title, products }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <ProductGrid products={products} />
  </div>
);

export default Accessories;