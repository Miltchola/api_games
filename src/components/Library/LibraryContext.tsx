import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LibraryGame = {
  id: number;
  status: 'Jogando' | 'Zerado' | 'Quero Jogar';
};

interface LibraryContextType {
  library: LibraryGame[];
  addToLibrary: (gameId: number) => Promise<void>;
  removeFromLibrary: (gameId: number) => Promise<void>;
  setGameStatus: (gameId: number, status: LibraryGame['status']) => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const libraryKey = username ? `library_${username}` : 'library_guest';

  const [library, setLibrary] = useState<LibraryGame[]>(() => {
    const stored = localStorage.getItem(libraryKey);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    const handleStorage = () => {
      const newUsername = localStorage.getItem('username');
      setUsername(newUsername);
      const newKey = newUsername ? `library_${newUsername}` : 'library_guest';
      const stored = localStorage.getItem(newKey);
      setLibrary(stored ? JSON.parse(stored) : []);
    };

    window.addEventListener('storage', handleStorage);
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

  const addToLibrary = async (gameId: number): Promise<void> => {
    setLibrary(prev => {
      if (prev.some(g => g.id === gameId)) return prev;
      const updated = [...prev, { id: gameId, status: 'Quero Jogar' }];
      localStorage.setItem(libraryKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromLibrary = async (gameId: number): Promise<void> => {
    setLibrary(prev => {
      const updated = prev.filter(g => g.id !== gameId);
      localStorage.setItem(libraryKey, JSON.stringify(updated));
      return updated;
    });
  };

  const setGameStatus = async (gameId: number, status: LibraryGame['status']): Promise<void> => {
    setLibrary(prev => {
      const updated = prev.map(g => g.id === gameId ? { ...g, status } : g);
      localStorage.setItem(libraryKey, JSON.stringify(updated));
      return updated;
    });
  };

  const refreshLibrary = async (): Promise<void> => {
    const stored = localStorage.getItem(libraryKey);
    setLibrary(stored ? JSON.parse(stored) : []);
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, setGameStatus, refreshLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};