import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (gameId: number) => void;
  removeFromWishlist: (gameId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const wishlistKey = username ? `wishlist_${username}` : 'wishlist_guest';

  const [wishlist, setWishlist] = useState<number[]>(() => {
    const stored = localStorage.getItem(wishlistKey);
    return stored ? JSON.parse(stored) : [];
  });

  // Atualiza username e wishlist quando username mudar no localStorage
  useEffect(() => {
    const handleStorage = () => {
      const newUsername = localStorage.getItem('username');
      setUsername(newUsername);
      const newKey = newUsername ? `wishlist_${newUsername}` : 'wishlist_guest';
      const stored = localStorage.getItem(newKey);
      setWishlist(stored ? JSON.parse(stored) : []);
    };

    window.addEventListener('storage', handleStorage);
    // Também verifica mudanças locais (login/logout no mesmo tab)
    const interval = setInterval(() => {
      const newUsername = localStorage.getItem('username');
      if (newUsername !== username) {
        handleStorage();
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [username]);

  const addToWishlist = (gameId: number) => {
    setWishlist(prev => {
      const updated = prev.includes(gameId) ? prev : [...prev, gameId];
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (gameId: number) => {
    setWishlist(prev => {
      const updated = prev.filter(id => id !== gameId);
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
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