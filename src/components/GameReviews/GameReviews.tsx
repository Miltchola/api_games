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
  const [newReview, setNewReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/reviews/game/rawg/${gameId}`);
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to submit a review.');
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rawgId: gameId, text: newReview }) // <-- use rawgId
      });
      if (!response.ok) throw new Error('Failed to submit review');
      setNewReview('');
      // Atualiza as reviews após criar
      const updated = await fetch(`${API_URL}/reviews/game/rawg/${gameId}`);
      setReviews(await updated.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="reviews-loading">Loading reviews...</div>;
  if (error) return <div className="reviews-error">Error: {error}</div>;

  return (
    <div className="reviews-container">
      <h3 className="reviews-title">Game Reviews</h3>
      {localStorage.getItem('token') && (
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <textarea
            className="review-input"
            value={newReview}
            onChange={e => setNewReview(e.target.value)}
            placeholder="Write your review..."
            rows={3}
            disabled={submitting}
          />
          <button type="submit" disabled={submitting || !newReview.trim()}>
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
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