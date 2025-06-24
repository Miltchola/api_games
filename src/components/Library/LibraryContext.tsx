import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type GameStatus = 'Jogando' | 'Zerado' | 'Quero Jogar';

interface LibraryGame {
  gameId: number;
  status: GameStatus;
}

interface LibraryContextType {
  library: LibraryGame[];
  addToLibrary: (gameId: number, status?: GameStatus) => Promise<void>;
  removeFromLibrary: (gameId: number) => Promise<void>;
  updateStatus: (gameId: number, status: GameStatus) => Promise<void>;
  refreshLibrary: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [library, setLibrary] = useState<LibraryGame[]>([]);

  // Busca a biblioteca do usuário ao carregar
  const fetchLibrary = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/library`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      // Se data for array, use diretamente. Se for objeto, use data.games.
      const games = Array.isArray(data) ? data : (data.games || []);
      console.log('Resposta do backend:', data);
      setLibrary(games.map((gameId: number) => ({
        gameId,
        status: 'Quero Jogar'
      })));
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const addToLibrary = async (gameId: number, status: GameStatus = 'Quero Jogar'): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/library/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rawgId: gameId })
    });
    if (res.ok) {
      setLibrary(prev => [...prev, { gameId, status }]);
    }
  };

  const removeFromLibrary = async (gameId: number): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_URL}/library/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ rawgId: gameId })
    });
    if (res.ok) {
      setLibrary(prev => prev.filter(g => g.gameId !== gameId));
    }
  };

  const updateStatus = async (gameId: number, status: GameStatus): Promise<void> => {
    // Se quiser salvar o status no backend, crie um endpoint para isso.
    setLibrary(prev => prev.map(g => g.gameId === gameId ? { ...g, status } : g));
  };

  const refreshLibrary = async (): Promise<void> => {
    await fetchLibrary();
  };

  return (
    <LibraryContext.Provider value={{ library, addToLibrary, removeFromLibrary, updateStatus, refreshLibrary }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};