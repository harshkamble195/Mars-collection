import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and load user profile if token is present
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profile = await api.auth.getProfile();
          setUser({
            _id: profile._id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            address: profile.address,
          });
          setWishlist(profile.wishlist || []);
        } catch (error) {
          console.error('Session expired or invalid token', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.login(email, password);
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        address: data.address,
      });
      
      // Load full profile to get wishlist
      const profile = await api.auth.getProfile();
      setWishlist(profile.wishlist || []);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await api.auth.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser({
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        address: {},
      });
      setWishlist([]);
      setLoading(false);
      return data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setWishlist([]);
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedData = await api.auth.updateProfile(profileData);
      // If server returned new token, update it
      if (updatedData.token) {
        localStorage.setItem('token', updatedData.token);
      }
      setUser({
        _id: updatedData._id,
        name: updatedData.name,
        email: updatedData.email,
        role: updatedData.role,
        address: updatedData.address,
      });
      return updatedData;
    } catch (error) {
      throw error;
    }
  };

  // Wishlist Actions
  const toggleWishlist = async (product) => {
    if (!user) {
      throw new Error('Please login to manage your wishlist');
    }

    const productId = product._id || product;
    const isAlreadyInWishlist = wishlist.some((item) => (item._id || item) === productId);

    try {
      if (isAlreadyInWishlist) {
        const updatedWishlist = await api.auth.removeFromWishlist(productId);
        setWishlist(updatedWishlist);
        return false; // Removed
      } else {
        const updatedWishlist = await api.auth.addToWishlist(productId);
        setWishlist(updatedWishlist);
        return true; // Added
      }
    } catch (error) {
      console.error('Error toggling wishlist', error);
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        wishlist,
        loading,
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isInWishlist,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
