import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import cartService from '../services/cartService';

export const CartContext = createContext(null);

const CART_STORAGE_KEY = 'flexwear_cart';

const loadLocalCart = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
};

const saveLocalCart = (items) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const normalizeItem = (item) => {
  const productId = item.product?._id || item.productId || item.product;
  const price = item.price || item.product?.discountedPrice || item.product?.price || 0;

  return {
    id: item._id || `${productId}-${item.size}-${item.color}`,
    _id: item._id,
    productId,
    name: item.name || item.product?.name || '',
    price,
    quantity: item.quantity || 1,
    size: item.size,
    color: item.color,
    image: item.product?.images?.[0] || item.image || null,
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => loadLocalCart());
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const setCartState = (items) => {
    setCartItems(items);
    saveLocalCart(items);
  };

  const normalizeItems = (items) => {
    return items.map(normalizeItem);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems(loadLocalCart());
      return;
    }

    setLoading(true);
    try {
      const response = await cartService.getCart();
      const items = response.data?.data?.items || response.data?.cart?.items || [];
      setCartState(normalizeItems(items));
    } catch (err) {
      console.error('Fetch cart failed', err);
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async () => {
    if (!isAuthenticated) return;

    const guestItems = loadLocalCart().filter((item) => !item._id);
    if (guestItems.length === 0) return;

    setLoading(true);
    try {
      await cartService.mergeCart({
        guestItems: guestItems.map(({ productId, quantity, size, color }) => ({ productId, quantity, size, color }))
      });
      saveLocalCart([]);
      await fetchCart();
    } catch (err) {
      console.error('Cart sync failed', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size, color) => {
    const productId = product._id || product.id || product.productId;
    const price = product.price || product.discountedPrice || 0;
    const name = product.name || '';
    const image = product.images?.[0] || product.image || null;

    const existingIndex = cartItems.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );

    const nextItems = [...cartItems];
    if (existingIndex > -1) {
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + quantity,
      };
    } else {
      nextItems.push({
        id: `${productId}-${size}-${color}`,
        productId,
        name,
        price,
        quantity,
        size,
        color,
        image,
      });
    }

    setCartState(nextItems);

    if (isAuthenticated) {
      try {
        await cartService.addToCart({ productId, quantity, size, color });
        await fetchCart();
      } catch (err) {
        console.error('Add to cart sync failed', err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    const nextItems = cartItems.filter((item) => item.id !== itemId);
    setCartState(nextItems);

    if (isAuthenticated && item?._id) {
      try {
        await cartService.removeCartItem(item._id);
        await fetchCart();
      } catch (err) {
        console.error('Remove from cart failed', err);
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    const nextItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setCartState(nextItems);

    if (isAuthenticated && item?._id) {
      try {
        await cartService.updateCartItem(item._id, quantity);
        await fetchCart();
      } catch (err) {
        console.error('Update quantity failed', err);
      }
    }
  };

  const clearCart = async () => {
    setCartState([]);

    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.error('Clear cart failed', err);
      }
    }
  };

  useEffect(() => {
    syncCart();
  }, []);

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
