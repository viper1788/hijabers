import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getTier, unitPrice, seriesQty, TIER2_MIN, TIER3_MIN } from '../lib/pricing.js';

const CartContext = createContext(null);

// qty = jumlah SERI per model (1 seri = semua warna, 4 atau 6 pcs)
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.key === product.id);
      if (ex) return prev.map(i => i.key === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { key: product.id, product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((key) => setCartItems(p => p.filter(i => i.key !== key)), []);

  const updateQty = useCallback((key, delta) => {
    setCartItems(p => p.map(i => i.key === key ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const value = useMemo(() => {
    const tier = getTier(cartItems);
    const lines = cartItems.map(i => {
      const pcsPerSeries = seriesQty(i.product);
      const pcs = pcsPerSeries * i.qty;
      const price = unitPrice(i.product, tier);
      return { ...i, pcsPerSeries, pcs, unit: price, normalUnit: unitPrice(i.product, 1), subtotal: price * pcs };
    });
    const cartTotal = lines.reduce((s, l) => s + l.subtotal, 0);
    const normalTotal = lines.reduce((s, l) => s + l.normalUnit * l.pcs, 0);
    const nextMin = tier === 1 ? TIER2_MIN : tier === 2 ? TIER3_MIN : null;
    return {
      cartItems: lines, tier, cartTotal, normalTotal,
      savings: normalTotal - cartTotal,
      cartSeries: lines.reduce((s, l) => s + l.qty, 0),
      cartCount: lines.reduce((s, l) => s + l.qty, 0),
      cartPcs: lines.reduce((s, l) => s + l.pcs, 0),
      cartWeight: lines.reduce((s, l) => s + (Number(l.product.weight) || 0) * l.pcs, 0), // estimasi, kg
      nextTierRemaining: nextMin ? Math.max(0, nextMin + 1 - normalTotal) : 0,
      nextTier: tier === 3 ? null : tier + 1,
    };
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ ...value, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
