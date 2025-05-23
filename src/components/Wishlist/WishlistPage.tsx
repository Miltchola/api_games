import React, { useEffect, useState } from 'react';
import { useWishlist } from './WishlistContext';
import { Link } from 'react-router-dom';
import './WishlistPage.css';

interface Game {
  id: number;
  name: string;
  background_image: string;
}

const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      const results: Game[] = [];
      for (const id of wishlist) {
        const res = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        if (res.ok) {
          const data = await res.json();
          results.push({ id: data.id, name: data.name, background_image: data.background_image });
        }
      }
      setGames(results);
      setLoading(false);
    };
    if (wishlist.length > 0) fetchGames();
    else setGames([]);
  }, [wishlist]);

  if (loading) return <div className="wishlist-empty">Loading your wishlist...</div>;
  if (games.length === 0) return <div className="wishlist-empty">Your wishlist is empty.</div>;

  return (
    <div className="wishlist-page">
      <h2 className='wishlist-title'>My Wishlist</h2>
      <div className="wishlist-list">
        {games.map(game => (
          <div key={game.id} className="wishlist-item">
            <Link to={`/game/${game.id}`}>
              <img src={game.background_image} alt={game.name} className="wishlist-img" />
              <div>{game.name}</div>
            </Link>
            <button onClick={() => removeFromWishlist(game.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;