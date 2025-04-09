
import React, { useEffect, useState } from 'react';
import './GameReviews.css';

interface Review {
  id: string;
  text: string;
  user?: { username: string }; // Adjusted based on potential API structure
  created_at?: string; // Adjusted based on potential API structure
}

interface GameReviewsProps {
  gameId: string;
}

const GameReviews: React.FC<GameReviewsProps> = ({ gameId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = 'ac25b624a98d4348bc5c4a45abb34eed';

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.rawg.io/api/games/${gameId}/reviews?key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        console.log(data); // Log the API response to inspect its structure
        setReviews(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gameId]);

  if (loading) return <div className="reviews-loading">Loading reviews...</div>;
  if (error) return <div className="reviews-error">Error: {error}</div>;

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Game Reviews</h3>
      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews available for this game.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <p className="review-text">"{review.text}"</p>
            <p className="review-author">- {review.user?.username || 'Anonymous'}</p>
            <p className="review-date">
              {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default GameReviews;