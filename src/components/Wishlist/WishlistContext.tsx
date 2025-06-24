import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlist: number[];
  addToWishlist: (gameId: number) => Promise<void>;
  removeFromWishlist: (gameId: number) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Busca a wishlist do usuário ao carregar
  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      // Suporte tanto para array quanto para objeto com .games
      const games = Array.isArray(data) ? data : (data.games || []);
      setWishlist(games);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (gameId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rawgId: gameId })
    });
    if (res.ok) {
      setWishlist(prev => prev.includes(gameId) ? prev : [...prev, gameId]);
    }
  };

  const removeFromWishlist = async (gameId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/wishlist/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rawgId: gameId })
    });
    if (res.ok) {
      setWishlist(prev => prev.filter(id => id !== gameId));
    }
  };

  const refreshWishlist = async (): Promise<void> => {
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};