import React, { useState, useEffect } from 'react';
import GameCard from '../GameCard/GameCard';

interface Game {
  id: number;
  name: string;
  released: string;
  background_image: string;
  rating: number;
  ratings_count: number;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&dates=2015-01-01,2024-12-31&ordering=-added&page_size=5`
        );
        
        if (!response.ok) throw new Error('Failed to fetch games');
        
        const data = await response.json();
        setGames(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="games-grid">
      {games.map((game) => (
        <GameCard
          key={game.id}
          title={game.name}
          subtitle={`${game.ratings_count} ratings`}
          imageUrl={game.background_image || '/placeholder-game.jpg'}
          isTrending={game.rating > 4}
          releaseInfo={new Date(game.released).toLocaleDateString()}
          rating={game.rating}
        />
      ))}
    </div>
  );
};

export default GameList;