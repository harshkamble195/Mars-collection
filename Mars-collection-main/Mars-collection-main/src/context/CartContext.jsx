import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1, size, color) => {
    setCartItems((prevItems) => {
      // Find item with same ID, size, and color
      const existingIndex = prevItems.findIndex(
        (item) => item.product === product._id && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].qty += qty;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.images[0],
            price: product.price,
            discount: product.discount || 0,
            size,
            color,
            qty,
            stock: product.stock,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product === productId && item.size === size && item.color === color)
      )
    );
  };

  const updateCartQty = (productId, size, color, qty) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === productId && item.size === size && item.color === color
          ? { ...item, qty: Math.min(qty, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  // Promo code validation
  const applyPromoCode = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === 'MARS10') {
      setPromoCode('MARS10');
      setDiscountPercent(10);
      return { success: true, message: '10% discount applied!' };
    } else if (uppercaseCode === 'LUXURY20') {
      setPromoCode('LUXURY20');
      setDiscountPercent(20);
      return { success: true, message: '20% discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => {
    const finalPrice = item.price * (1 - item.discount / 100);
    return acc + finalPrice * item.qty;
  }, 0);

  const discountPrice = itemsPrice * (discountPercent / 100);
  const taxPrice = (itemsPrice - discountPrice) * 0.08; // 8% sales tax
  
  // Free shipping on orders over $150
  const shippingPrice = itemsPrice > 150 || itemsPrice === 0 ? 0 : 15;
  
  const totalPrice = itemsPrice - discountPrice + taxPrice + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        promoCode,
        discountPercent,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        applyPromoCode,
        removePromoCode,
        itemsPrice: Number(itemsPrice.toFixed(2)),
        discountPrice: Number(discountPrice.toFixed(2)),
        taxPrice: Number(taxPrice.toFixed(2)),
        shippingPrice: Number(shippingPrice.toFixed(2)),
        totalPrice: Number(totalPrice.toFixed(2)),
        cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
