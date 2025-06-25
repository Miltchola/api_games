import React, { useEffect, useState } from 'react';
import './GameReviews.css';

interface Review {
  _id: string;
  username: string | undefined;
  id: string;
  text: string;
  user?: { _id?: string; username: string };
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
    const fetchGameAndReviews = async () => {
      try {
        setLoading(true);

        await fetch(`${API_URL}/games/rawg/${gameId}`);
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

    fetchGameAndReviews();
  }, [gameId]);

  // Publicação de Reviews
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
        body: JSON.stringify({ rawgGameId: gameId, text: newReview })
      });
      if (!response.ok) throw new Error('Failed to submit review');
      else console.log('Review submitted successfully');
      setNewReview('');
      // Atualiza as reviews após criar
      const updated = await fetch(`${API_URL}/reviews/game/rawg/${gameId}`);
      const updatedData = await updated.json();
      setReviews(Array.isArray(updatedData) ? updatedData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

    const loggedUserId = localStorage.getItem('userId');

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to delete a review.');
      const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete review');
      // Atualiza as reviews após deletar
      setReviews(reviews.filter((r) => r.id !== reviewId && r._id !== reviewId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
        reviews.map((review) => {
          const reviewUserId =
            typeof review.user === 'string'
              ? review.user
              : review.user?._id;

          const isAuthor =
            !!reviewUserId && !!loggedUserId && reviewUserId.toString() === loggedUserId.toString();

          console.log('Review User: ', review.user);
          console.log('Logged User ID: ', loggedUserId);
          console.log('Is Author: ', isAuthor);
          
          return (
            <div key={review.id || review._id} className="review-card" style={{ position: 'relative' }}>
              {isAuthor && (
                <button
                  className="delete-review-btn"
                  title="Delete review"
                  onClick={() => handleDeleteReview(review.id || review._id)}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'transparent',
                    border: 'none',
                    color: '#ff5555',
                    fontWeight: 'bold',
                    fontSize: 18,
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              )}
              <p className="review-text">
                {review.text.replace(/<[^>]*>/g, '')}
              </p>
              <p className="review-author">- {review.username || review.user?.username || 'Anonymous'}</p>
              <p className="review-date">
                {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'Unknown date'}
              </p>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameReviews;