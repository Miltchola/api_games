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

interface GameListProps {
  sortBy: 'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id';
  searchQuery: string; // New prop for search functionality
}

const GameList: React.FC<GameListProps> = ({ sortBy, searchQuery }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.rawg.io/api/games?key=${API_KEY}&dates=2015-01-01,2024-12-31&ordering=-added&page_size=100`
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

  const sortFunctions = {
    ratingPositive: (a: Game, b: Game) => b.rating - a.rating,
    ratingNegative: (a: Game, b: Game) => a.rating - b.rating,
    name: (a: Game, b: Game) => a.name.localeCompare(b.name),
    isTrending: (a: Game, b: Game) => b.rating - a.rating, // Assuming trending is based on rating
    id: (a: Game, b: Game) => a.id - b.id, // New sorting function for Home
  };

  // Filter games based on the search query
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="games-grid">
      {filteredGames.sort(sortFunctions[sortBy]).map((game) => (
        <GameCard
          key={game.id}
          id={game.id.toString()} // Convert id to string
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
