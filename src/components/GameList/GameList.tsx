import React, { useState, useEffect } from 'react';
import GameCard from '../GameCard/GameCard';

interface Game {
  rawgId: number;
  title: string;
  releaseDate?: string;
  backgroundImage?: string;
  rating?: number;
  ratingsCount?: number;
  genres?: string;
  // Adicione outros campos conforme necessário
}

interface GameListProps {
  sortBy: 'ratingPositive' | 'ratingNegative' | 'name' | 'isTrending' | 'id';
  searchQuery: string;
}

const GameList: React.FC<GameListProps> = ({ sortBy, searchQuery }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/games?dates=2011-01-01,2024-12-31&ordering=-added&page_size=21`
        );

        if (!response.ok) throw new Error('Failed to fetch games');

        const data = await response.json();

        setGames(
          Array.isArray(data)
            ? data.map((game: any) => ({
                ...game,
                backgroundImage: game.background_image,
                ratingsCount: game.ratings_count,
                rating: typeof game.rating === 'string' ? Number(game.rating) : game.rating,
                genres: typeof game.genres === 'string'
                  ? game.genres
                  : Array.isArray(game.genres)
                    ? game.genres.map((g: any) => g.name || g).join(', ')
                    : '',
             }))
        : []
      );
      
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  const sortFunctions = {
    ratingPositive: (a: Game, b: Game) => (b.rating ?? 0) - (a.rating ?? 0),
    ratingNegative: (a: Game, b: Game) => (a.rating ?? 0) - (b.rating ?? 0),
    name: (a: Game, b: Game) => a.title.localeCompare(b.title),
    isTrending: (a: Game, b: Game) => (b.rating ?? 0) - (a.rating ?? 0),
    id: (a: Game, b: Game) => (a.rawgId ?? 0) - (b.rawgId ?? 0),
  };

  // Filtra os jogos pelo título
  const filteredGames = games.filter((game) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = game.title.toLowerCase().includes(query);
    const genreMatch = game.genres?.toLowerCase().includes(query);
    return titleMatch || genreMatch;
  });

  if (loading) return <div className="loading">Loading games...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="games-grid">
      {filteredGames.sort(sortFunctions[sortBy]).map((game) => (
        <GameCard
          key={game.rawgId}
          id={game.rawgId.toString()}
          title={game.title}
          subtitle={`${game.ratingsCount ?? 0} ratings`}
          imageUrl={game.backgroundImage || '/placeholder-game.jpg'}
          isTrending={(game.rating ?? 0) > 4}
          releaseInfo={
            game.releaseDate
              ? new Date(game.releaseDate).toLocaleDateString()
              : 'Data desconhecida'
          }
          rating={game.rating ?? 0}
        />
      ))}
    </div>
  );
};

export default GameList;