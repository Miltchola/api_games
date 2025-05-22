import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (gameId: number) => void;
  removeFromWishlist: (gameId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  const addToWishlist = (gameId: number) => {
    setWishlist(prev => {
      const updated = prev.includes(gameId) ? prev : [...prev, gameId];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (gameId: number) => {
    setWishlist(prev => {
      const updated = prev.filter(id => id !== gameId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};