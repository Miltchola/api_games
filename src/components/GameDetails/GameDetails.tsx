import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './GameDetails.css';
import plus from '../../assets/Icons/plus.png';
import love from '../../assets/Icons/love.png';
import GameReviews from '../GameReviews/GameReviews';
import { useWishlist } from '../Wishlist/WishlistContext';
import { useLibrary } from '../Library/LibraryContext';
import { useAuth } from '../User/AuthContext';
import RatingStars from './RatingStars';

interface GameDetailsProps {
  rawgId: number;
  title: string;
  description: string;
  backgroundImage: string;
  releaseDate: string;
  rating: number;
  ratingsCount?: number;
}

const GameDetails: React.FC = () => {
  const { rawgId } = useParams<{ rawgId: string }>();
  const [game, setGame] = useState<GameDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { library, addToLibrary, removeFromLibrary } = useLibrary();
  const { isAuthenticated, getToken } = useAuth();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [mongoGameId, setMongoGameId] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const isInWishlist = game && wishlist.includes(Number(game.rawgId));
  const isInLibrary = game && library.some(item => item.gameId === Number(game.rawgId));

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/games/${rawgId}`);
        if (!response.ok) throw new Error('Failed to fetch game details');
        const data = await response.json();
        console.log('Dados recebidos:', data);
        setGame({
          ...data,
          backgroundImage: data.background_image,
          ratingsCount: data.ratings_count,
          releaseDate: data.releaseDate || data.release_date,
          description: data.description || data.desc || '', // ajuste conforme o campo real
        });
        setMongoGameId(data._id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    const fetchRatings = async () => {
      if (!mongoGameId) return;
      try {
        const avgRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/average`);
        if (avgRes.ok) {
          const avgData = await avgRes.json();
          setAverageRating(avgData.average ?? null);
        }
        if (isAuthenticated) {
          const userRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/user`, {
            headers: { Authorization: `Bearer ${getToken?.()}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUserRating(userData.rating ?? null);
          }
        } else {
          setUserRating(null);
        }
      } catch (err) {
        setRatingError('Erro ao buscar ratings');
      }
    };

    fetchGameDetails();
    fetchRatings();
  }, [rawgId, isAuthenticated]);

  useEffect(() => {
    if (mongoGameId) {
      const fetchRatings = async () => {
        try {
          const avgRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/average`);
          if (avgRes.ok) {
            const avgData = await avgRes.json();
            setAverageRating(avgData.average ?? null);
          }
          if (isAuthenticated) {
            const userRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/user`, {
              headers: { Authorization: `Bearer ${getToken?.()}` },
            });
            if (userRes.ok) {
              const userData = await userRes.json();
              setUserRating(userData.rating ?? null);
            }
          } else {
            setUserRating(null);
          }
        } catch (err) {
          setRatingError('Erro ao buscar ratings');
        }
      };
      fetchRatings();
    }
  }, [mongoGameId, isAuthenticated]);

  const handleRate = async (rating: number) => {
    if (!isAuthenticated || !mongoGameId) {
      alert('Você precisa estar logado para avaliar.');
      return;
    }
    setRatingLoading(true);
    setRatingError(null);
    try {
      const method = userRating ? 'PUT' : 'POST';
      const res = await fetch(`${API_URL}/ratings`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken?.()}`,
        },
        body: JSON.stringify({
          gameId: mongoGameId,
          rating,
        }),
      });
      if (!res.ok) throw new Error('Erro ao salvar avaliação');
      setUserRating(rating);
      // Atualiza média
      const avgRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/average`);
      if (avgRes.ok) {
        const avgData = await avgRes.json();
        setAverageRating(avgData.average ?? null);
      }
    } catch (err) {
      setRatingError('Erro ao salvar avaliação');
    } finally {
      setRatingLoading(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!isAuthenticated || !mongoGameId) return;
    setRatingLoading(true);
    setRatingError(null);
    try {
      const res = await fetch(`${API_URL}/ratings`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken?.()}`,
        },
        body: JSON.stringify({
          gameId: mongoGameId,
        }),
      });
      if (!res.ok) throw new Error('Erro ao remover avaliação');
      setUserRating(null);
      // Atualiza média
      const avgRes = await fetch(`${API_URL}/ratings/game/${mongoGameId}/average`);
      if (avgRes.ok) {
        const avgData = await avgRes.json();
        setAverageRating(avgData.average ?? null);
      }
    } catch (err) {
      setRatingError('Erro ao remover avaliação');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <div>Loading game details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!game) return <div>Game not found</div>;

  return (
    <div className="game-details">
      <div className="game-main">
        <h1 className="game-title">{game.title}</h1>
        
        <div className="rating-container">
          <span className="rating-label">Média Geral:</span>
          <span className="rating-stars">
            <RatingStars rating={game.rating} />
          </span>
          <span className="rating-value">{game.rating.toFixed(1)}/5</span>
        </div>

        <div className="rating-container">
          <span className="rating-label">Média dos usuários:</span>
          <span className="rating-stars">
            <RatingStars rating={averageRating ?? 0} />
          </span>
          <span className="rating-value">{(averageRating ?? 0).toFixed(1)}/5</span>
        </div>

        <div className="user-rating-container">
          <span className="rating-label">Sua avaliação:</span>
          <RatingStars
            rating={userRating ?? 0}
            onRate={handleRate}
            editable={isAuthenticated}
          />
          {userRating && (
            <button onClick={handleRemoveRating} disabled={ratingLoading} style={{ marginLeft: 8 }}>
              Remover avaliação
            </button>
          )}
          {ratingLoading && <span>Salvando...</span>}
          {ratingError && <span style={{ color: 'red' }}>{ratingError}</span>}
        </div>

        <img 
          className="game-image" 
          src={game.backgroundImage} 
          alt={game.title} 
        />

        <div className="game-buttons">
          <button
            className="buttons-my-game"
            onClick={() => {
              if (!isAuthenticated) {
                alert('You must be logged in to add games to your library.');
                return;
              }
              if (game) {
                isInLibrary
                  ? removeFromLibrary(Number(game.rawgId))
                  : addToLibrary(Number(game.rawgId));
              }
            }}
            disabled={!isAuthenticated}
          >
            <div className="buttons-my-game-left">
              <img className="button-img" src={plus} alt="Plus icon" />
            </div>
            <div className="buttons-my-game-right">
              <p className="button-subtext">{isInLibrary ? 'Remove from' : 'Add to'}</p>
              <h6 className="button-text">My Games</h6>
            </div>
          </button>

          <button
            className="buttons-wishlist"
            onClick={() => {
              if (!isAuthenticated) {
                alert('You must be logged in to add games to your wishlist.');
                return;
              }
              if (game) {
                isInWishlist ? removeFromWishlist(Number(game.rawgId)) : addToWishlist(Number(game.rawgId));
              }
            }}
            disabled={!isAuthenticated}
          >
            <div className="buttons-wishlist-left">
              <img className="button-img" src={love} alt="Love icon" />
            </div>
            <div className="buttons-wishlist-right">
              <p className="button-subtext">{isInWishlist ? 'Remove from' : 'Add to'}</p>
              <h6 className="button-text">Wishlist</h6>
            </div>
          </button>
        </div>

        <div className="game-info">
          <h3 className="info-title">About the Game</h3>
          <p className="game-description">
            {game.description.replace(/<[^>]*>/g, '')}
          </p>
          <h3 className="info-title">Release Date: {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'Unknown'}</h3>
        </div>
      </div>

      <div className="game-reviews">
        <GameReviews gameId={rawgId!} />
      </div>
    </div>
  );
};

export default GameDetails;