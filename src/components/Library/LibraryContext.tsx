import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LibraryContextType {
  library: number[];
  addToLibrary: (gameId: number) => Promise<void>;
  removeFromLibrary: (gameId: number) => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const libraryKey = username ? `library_${username}` : 'library_guest';

  const [library, setLibrary] = useState<number[]>(() => {
    const stored = localStorage.getItem(libraryKey);
    return stored ? JSON.parse(stored) : [];
  });

  // Atualiza username e library quando username mudar no localStorage
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
      const updated = prev.includes(gameId) ? prev : [...prev, gameId];
      localStorage.setItem(libraryKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromLibrary = async (gameId: number): Promise<void> => {
    setLibrary(prev => {
      const updated = prev.filter(id => id !== gameId);
      localStorage.setItem(libraryKey, JSON.stringify(updated));
      return updated;
    });
  };

  const refreshLibrary = async (): Promise<void> => {
    const stored = localStorage.getItem(libraryKey);
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