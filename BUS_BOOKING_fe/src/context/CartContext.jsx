import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.user.authenticated);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/booking/pending-count');
      console.log('hi');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const incrementCartCount = () => {
    setCartCount(prev => prev + 1);
  };

  const decrementCartCount = () => {
    setCartCount(prev => Math.max(0, prev - 1));
  };

  return (
    <CartContext.Provider value={{ 
      cartCount, 
      updateCartCount, 
      incrementCartCount, 
      decrementCartCount,
      fetchCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
