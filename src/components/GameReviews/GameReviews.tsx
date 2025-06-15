import React, { useEffect, useState } from 'react';
import './GameReviews.css';

interface Review {
  id: string;
  text: string;
  user?: { username: string };
  created_at?: string;
}

interface GameReviewsProps {
  gameId: string;
}

const GameReviews: React.FC<GameReviewsProps> = ({ gameId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/games/${gameId}/reviews`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
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
            <p className="review-text">
              {review.text.replace(/<[^>]*>/g, '')}
            </p>
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