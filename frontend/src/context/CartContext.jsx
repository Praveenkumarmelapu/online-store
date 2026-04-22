import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total_items: 0, total_price: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total_items: 0, total_price: 0 });
      return;
    }
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await cartAPI.updateCartItem(itemId, quantity);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to update cart:', error);
      throw error;
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await cartAPI.removeCartItem(itemId);
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const response = await cartAPI.clearCart();
      setCart(response.data);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    fetchCart,
    cartItemsCount: cart.total_items || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
