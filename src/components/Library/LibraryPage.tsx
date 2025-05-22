import React, { useEffect, useState } from 'react';
import { useLibrary } from './LibraryContext';
import { Link } from 'react-router-dom';
import './LibraryPage.css';

interface Game {
  id: number;
  name: string;
  background_image: string;
}

const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

const LibraryPage: React.FC = () => {
  const { library, removeFromLibrary } = useLibrary();
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const results: Game[] = [];
      for (const id of library) {
        const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        if (res.ok) {
          const data = await res.json();
          results.push({ id: data.id, name: data.name, background_image: data.background_image });
        }
      }
      setGames(results);
    };
    if (library.length > 0) fetchGames();
    else setGames([]);
  }, [library]);

  if (games.length === 0)
    return <div className="wishlist-empty">Your library is empty.</div>;

  return (
    <div className="wishlist-page">
      <h2 className='wishlist-title'>My Library</h2>
      <div className="wishlist-list">
        {games.map(game => (
          <div key={game.id} className="wishlist-item">
            <Link to={`/game/${game.id}`}>
              <img src={game.background_image} alt={game.name} className="wishlist-img" />
              <div>{game.name}</div>
            </Link>
            <button onClick={() => removeFromLibrary(game.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryPage;