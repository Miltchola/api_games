import React, { useEffect, useState } from 'react';
import { useWishlist } from './WishlistContext';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

interface Game {
  rawgId: number;
  title: string;
  backgroundImage: string;
}

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const results: Game[] = [];
      for (const rawgId of wishlist) {
        const res = await fetch(`${API_URL}/games/${rawgId}`);
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
    if (wishlist.length > 0) fetchGames();
    else setGames([]);
  }, [wishlist, API_URL]);

  if (loading) return <div className="wishlist-empty">Loading your wishlist...</div>;
  if (games.length === 0) return <div className="wishlist-empty">Your wishlist is empty.</div>;

  return (
    <div className="wishlist-page">
      <h2 className='wishlist-title'>My Wishlist</h2>
      <div className="wishlist-list">
        {games.map(game => (
          <div key={game.rawgId} className="wishlist-item">
            <Link to={`/game/${game.rawgId}`}>
              <img src={game.backgroundImage} alt={game.title} className="wishlist-img" />
              <div>{game.title}</div>
            </Link>
            <button onClick={() => removeFromWishlist(game.rawgId)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;