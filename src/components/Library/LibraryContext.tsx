import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LibraryContextType {
  library: number[]; // Agora é um array de IDs
  addToLibrary: (gameId: number) => Promise<void>;
  removeFromLibrary: (gameId: number) => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<number[]>(() => {
    const stored = localStorage.getItem('library');
    return stored ? JSON.parse(stored) : [];
  });

  const addToLibrary = async (gameId: number): Promise<void> => {
    setLibrary(prev => {
      const updated = prev.includes(gameId) ? prev : [...prev, gameId];
      localStorage.setItem('library', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromLibrary = async (gameId: number): Promise<void> => {
    setLibrary(prev => {
      const updated = prev.filter(id => id !== gameId);
      localStorage.setItem('library', JSON.stringify(updated));
      return updated;
    });
  };

  const refreshLibrary = async (): Promise<void> => {
    const stored = localStorage.getItem('library');
    setLibrary(stored ? JSON.parse(stored) : []);
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, refreshLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};