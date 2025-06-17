import React, { useEffect, useState } from 'react';
import { useLibrary } from './LibraryContext';
import { Link } from 'react-router-dom';
import './LibraryPage.css';

interface Game {
  rawgId: number;
  title: string;
  backgroundImage: string;
}

type GameStatus = 'Jogando' | 'Zerado' | 'Quero Jogar';

const statusOptions: GameStatus[] = ['Jogando', 'Zerado', 'Quero Jogar'];

const LibraryPage: React.FC = () => {
  const { library, removeFromLibrary, updateStatus } = useLibrary();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const results: Game[] = [];
      for (const item of library) {
        const res = await fetch(`${API_URL}/games/${item.gameId}`);
        if (res.ok) {
          const data = await res.json();
          results.push({
            ...data,
            backgroundImage: data.background_image,
          });
        }
      }
      setGames(results);
      setLoading(false);
    };
    if (library.length > 0) fetchGames();
    else setGames([]);
  }, [library, API_URL]);

  if (loading) return <div className="wishlist-empty">Loading your library...</div>;
  if (games.length === 0)
    return <div className="wishlist-empty">Your library is empty.</div>;

  return (
    <div className="wishlist-page">
      <h2 className='wishlist-title'>My Library</h2>
      <div className="wishlist-list">
        {games.map(game => {
          const libItem = library.find(g => g.gameId === game.rawgId);
          return (
            <div key={game.rawgId} className="wishlist-item">
              <Link to={`/game/${game.rawgId}`}>
                <img src={game.backgroundImage} alt={game.title} className="wishlist-img" />
                <div>{game.title}</div>
              </Link>
              <select
              className="wishlist-status-select"
                value={libItem?.status || 'Quero Jogar'}
                onChange={e => updateStatus(game.rawgId, e.target.value as GameStatus)}
              >
                {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <button onClick={() => removeFromLibrary(game.rawgId)}>Remove</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryPage;