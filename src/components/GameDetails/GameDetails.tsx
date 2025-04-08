import './GameDetails.css'

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import plus from '../../assets/icons/plus.png';
import love from '../../assets/icons/love.png';

interface GameDetailsProps {
  id: number;
  name: string;
  description: string;
  background_image: string;
  released: string;
  rating: number;
}

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch game details');
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) return <div>Loading game details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="game-details">

        <div className="game-main">
            <h1 className="game-title">{game?.name}</h1>

                {/* Avaliação do jogo em estrelas */}
                <div className="rating-container">
                    <span className="rating-stars">
                        {'★'.repeat(Math.round(game?.rating ?? 0))}
                        {'☆'.repeat(5 - Math.round(game?.rating ?? 0))}
                    </span>
                    <span className="rating-value">{game?.rating.toFixed(1)}/5</span>
                    <p className="game-release">Released: {game?.released}</p>
                </div>

            <img className="game-image" src={game?.background_image} alt={game?.name} />
        </div>

        <div className="game-buttons">

            <button className="buttons-my-game">
                <div className="buttons-my-game-left">
                    <img className="button-img" src={plus} alt="Plus icon" />
                </div>
                
                <div className="buttons-my-game-right">
                    <p className="button-subtext">Add to</p>
                    <h6 className="button-text">My Games</h6>
                </div>
            </button>

            <button className="buttons-wishlist">
                <div className="buttons-wishlist-left">
                    <img className="button-img" src={love} alt="Love icon" />
                </div>
                
                <div className="buttons-wishlist-right">
                    <p className="button-subtext">Add to</p>
                    <h6 className="button-text">Wishlist</h6>
                </div>
            </button>
        </div>

        <div className="game-info">
            <h3 className="info-title">About the Game</h3>
                <p className="game-description">{game?.description}</p>

            <h3 className="info-title">Release Date:</h3>
            <p className="game-release">Released: {game?.released}</p>
        </div>
      
    </div>
  );
};

export default GameDetails;