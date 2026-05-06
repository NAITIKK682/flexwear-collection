import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import cartService from '../services/cartService';

export const CartContext = createContext(null);

// ✅ CUSTOM HOOK EXPORT
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

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
  // ✅ FIX: Ensure productId is always a string and price is handled correctly
  const productId = item.product?._id || item.productId?._id || item.productId || item.product || '';
  const price = item.price || item.product?.discountedPrice || item.product?.price || 0;

  return {
    id: item.id || item._id || `${productId}-${item.size}-${item.color}`, // UI Unique ID
    _id: item._id || null, // MongoDB ID (Null for local items)
    productId,
    name: item.name || item.product?.name || 'Product',
    price: Number(price),
    quantity: Number(item.quantity) || 1,
    size: item.size || 'M',
    color: item.color || 'Default',
    image: item.product?.images?.[0] || item.image || null,
  };
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Initial Load
  useEffect(() => {
    setCartItems(loadLocalCart().map(normalizeItem));
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = () => cartTotal;

  useEffect(() => {
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, [cartItems]);

  const setCartState = (items) => {
    const normalized = items.map(normalizeItem);
    setCartItems(normalized);
    saveLocalCart(normalized);
  };

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await cartService.getCart();
      const items = response.data?.data?.items || response.data?.cart?.items || [];
      setCartState(items);
    } catch (err) {
      console.error('Fetch cart failed', err);
    }
  };

  const syncCart = async () => {
    if (!isAuthenticated) return;
    const localItems = loadLocalCart();
    
    setLoading(true);
    try {
      if (localItems.length > 0) {
        const guestItems = localItems
          .map((item) => ({
            // backend expects productId
            productId: item.productId,
            quantity: Number(item.quantity),
            size: item.size ? String(item.size) : undefined,
            color: item.color ? String(item.color) : undefined,
          }))
          // backend cartValidator requires valid productId + quantity>=1
          .filter((i) => i.productId && Number.isInteger(i.quantity) && i.quantity >= 1);

        if (guestItems.length > 0) {
          await cartService.mergeCart({ guestItems });
        }
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      await fetchCart();
    } catch (err) {
      console.error('Cart sync failed', err);
      // If merge fails, still fetch current server cart
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, size, color) => {
    const productId = product._id || product.id;
    
    // Optimistic UI Update
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === productId && item.size === size && item.color === color
    );

    let nextItems = [...cartItems];
    if (existingIndex > -1) {
      nextItems[existingIndex].quantity += quantity;
    } else {
      nextItems.push(normalizeItem({ ...product, quantity, size, color, productId }));
    }
    setCartState(nextItems);

    if (isAuthenticated) {
      try {
        // ✅ FIX: Ensure data types match backend requirements
        await cartService.addToCart({ 
          productId: String(productId), 
          quantity: Number(quantity), 
          size: String(size), 
          color: String(color) 
        });
        await fetchCart(); // Re-sync with server IDs
      } catch (err) {
        console.error('Add to cart sync failed', err);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    const itemToRemove = cartItems.find((i) => i.id === itemId);
    const updatedItems = cartItems.filter((i) => i.id !== itemId);
    setCartState(updatedItems);

    if (isAuthenticated) {
      try {
        // Try deleting by _id (server) or productId (backup)
        const idToDelete = itemToRemove._id || itemToRemove.productId;
        await cartService.removeCartItem(idToDelete);
        await fetchCart();
      } catch (err) {
        console.error('Remove from cart failed', err);
      }
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) return removeFromCart(itemId);

    const item = cartItems.find((i) => i.id === itemId);
    if (!item) return;

    setCartState(cartItems.map((i) => i.id === itemId ? { ...i, quantity } : i));

    if (isAuthenticated) {
      try {
        const idToUpdate = item._id || item.productId;
        await cartService.updateCartItem(idToUpdate, quantity);
        await fetchCart();
      } catch (err) {
        console.error('Update quantity failed', err);
      }
    }
  };

  const clearCart = async () => {
    setCartState([]);
    if (isAuthenticated) {
      try { await cartService.clearCart(); } catch (err) {}
    }
  };

  // Trigger sync on Auth change
  useEffect(() => {
    if (isAuthenticated) {
      syncCart();
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart: { items: cartItems, totalPrice: cartTotal },
        cartItems,
        loading,
        cartCount,
        cartTotal,
        getCartTotal,
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